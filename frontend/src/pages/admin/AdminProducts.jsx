import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Search, X, Image, Check } from "lucide-react";
import { adminService } from "../../services/adminService";
import { toast } from "sonner";

const emptyProduct = {
  name: "", description: "", short_description: "", price: "", compare_price: "",
  category_id: "", stock_quantity: 0, sku: "", images: [], colors: [], sizes: [],
  tags: [], is_featured: false, is_bestseller: false,
};

function ProductModal({ product, categories, onSave, onClose }) {
  const [form, setForm] = useState(product || emptyProduct);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [colorInput, setColorInput] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await adminService.uploadImage(formData);
      setForm((f) => ({ ...f, images: [...f.images, data.url] }));
      toast.success("Image uploaded!");
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); }
  };

  const addColor = () => {
    if (colorInput.trim() && !form.colors.includes(colorInput.trim())) {
      setForm((f) => ({ ...f, colors: [...f.colors, colorInput.trim()] }));
      setColorInput("");
    }
  };

  const removeColor = (c) => setForm((f) => ({ ...f, colors: f.colors.filter((x) => x !== c) }));
  const removeImage = (url) => setForm((f) => ({ ...f, images: f.images.filter((x) => x !== url) }));

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category_id) {
      toast.error("Name, price and category are required");
      return;
    }
    setSaving(true);
    try {
      await onSave({ ...form, price: parseFloat(form.price), compare_price: form.compare_price ? parseFloat(form.compare_price) : null, category_id: parseInt(form.category_id) });
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="font-bold text-gray-800 text-lg">{product ? "Edit Product" : "Add Product"}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Product Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-gold/40" />
          </div>

          {/* Short description */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Short Description</label>
            <input value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-gold/40" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 resize-none" />
          </div>

          {/* Price + Compare */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Price (₹) *</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-gold/40" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Compare Price (₹)</label>
              <input type="number" value={form.compare_price} onChange={(e) => setForm({ ...form, compare_price: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-gold/40" />
            </div>
          </div>

          {/* Category + Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Category *</label>
              <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-gold/40">
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Stock Quantity</label>
              <input type="number" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-gold/40" />
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Colors</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {form.colors.map((c) => (
                <span key={c} className="flex items-center gap-1 px-3 py-1 bg-brand-gold/10 rounded-full text-xs text-brand-dark">
                  {c} <button onClick={() => removeColor(c)}><X size={10} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={colorInput} onChange={(e) => setColorInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addColor())}
                placeholder="Add color..." className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-gold/40" />
              <button onClick={addColor} className="px-3 py-2 bg-brand-gold/20 text-brand-dark rounded-xl text-xs hover:bg-brand-gold/40 transition-colors">Add</button>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Images</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {form.images.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  <button onClick={() => removeImage(url)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                    <X size={10} />
                  </button>
                </div>
              ))}
              <label className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-brand-gold transition-colors">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                {uploading ? <div className="w-4 h-4 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" /> : <Image size={20} className="text-gray-400" />}
              </label>
            </div>
          </div>

          {/* Flash Sale */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Flash Sale Ends At (leave blank to disable)</label>
            <input type="datetime-local"
              value={form.sale_ends_at ? new Date(form.sale_ends_at).toISOString().slice(0,16) : ""}
              onChange={(e) => setForm({ ...form, sale_ends_at: e.target.value || null })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-gold/40" />
          </div>

          {/* Toggles */}
          <div className="flex gap-4">
            {[
              { key: "is_featured", label: "Featured" },
              { key: "is_bestseller", label: "Bestseller" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <div onClick={() => setForm((f) => ({ ...f, [key]: !f[key] }))}
                  className={`w-10 h-5 rounded-full transition-colors relative ${form[key] ? "bg-brand-gold" : "bg-gray-200"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form[key] ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
                <span className="text-sm text-gray-600">{label}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onClose} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className="px-5 py-2.5 bg-brand-dark text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-brand-gold transition-colors disabled:opacity-60">
              <Check size={15} /> {saving ? "Saving..." : "Save Product"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalProduct, setModalProduct] = useState(undefined);
  const [showModal, setShowModal] = useState(false);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    adminService.getProducts({ page, page_size: 20, search: search || undefined })
      .then(({ data }) => { setProducts(data.items); setTotal(data.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { adminService.getCategories().then(({ data }) => setCategories(data)).catch(() => {}); }, []);

  const handleSave = async (data) => {
    try {
      if (modalProduct?.id) {
        await adminService.updateProduct(modalProduct.id, data);
        toast.success("Product updated!");
      } else {
        await adminService.createProduct(data);
        toast.success("Product created!");
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to save product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await adminService.deleteProduct(id);
      toast.success("Product deleted");
      fetchProducts();
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Products <span className="text-gray-400 text-lg font-normal">({total})</span></h1>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">
            <Image size={15} /> Import CSV
            <input type="file" accept=".csv" className="hidden" onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              const fd = new FormData();
              fd.append("file", file);
              try {
                const { data } = await adminService.bulkUpload(fd);
                toast.success(`Imported ${data.created} products (${data.skipped} skipped)`);
                fetchProducts();
              } catch (err) {
                toast.error(err.response?.data?.detail || "Import failed");
              }
              e.target.value = "";
            }} />
          </label>
          <button onClick={() => { setModalProduct(null); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-dark text-white rounded-xl text-sm font-medium hover:bg-brand-gold transition-colors">
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-400 -mt-3">CSV columns: name, price, category_id, stock_quantity, compare_price, description, short_description, sku, images (|‑separated URLs), colors, sizes</p>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
          className="w-full sm:w-72 pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-gold/40" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-5 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
                ))
              ) : products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] && <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                      <span className="font-medium text-gray-800 line-clamp-1 max-w-xs">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{p.category?.name || "-"}</td>
                  <td className="px-5 py-3 font-semibold text-gray-800">₹{p.price.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.stock_quantity > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {p.stock_quantity}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${p.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => { setModalProduct(p); setShowModal(true); }}
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(p.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <ProductModal product={modalProduct} categories={categories} onSave={handleSave} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
