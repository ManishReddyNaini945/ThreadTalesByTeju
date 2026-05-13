import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Search, X, Image, Check, Upload } from "lucide-react";
import { adminService } from "../../services/adminService";
import { toast } from "sonner";

const gold = "#c8a45c";
const cream = "#f7f5f2";
const creamDim = "#a89f94";
const cardBg = "#1c1916";
const border = "#2d2824";
const modalBg = "#0f0d0c";

const inputStyle = {
  width: "100%", padding: "10px 14px",
  background: "#0c0a09", border: `1px solid ${border}`,
  color: cream, fontSize: 13, outline: "none",
};

const focusGold = (e) => { e.target.style.borderColor = gold; };
const blurBorder = (e) => { e.target.style.borderColor = border; };

const emptyProduct = {
  name: "", description: "", short_description: "", price: "", compare_price: "",
  category_id: "", stock_quantity: 0, sku: "", images: [], colors: [], color_images: {}, color_prices: {}, sizes: [],
  tags: [], is_featured: false, is_bestseller: false, sale_ends_at: "",
  pricing_unit: "piece",
};

function Toggle({ value, onChange, label }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div onClick={onChange}
        className="w-10 h-5 rounded-full relative transition-colors"
        style={{ background: value ? gold : border }}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full shadow transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`}
          style={{ background: cream }} />
      </div>
      <span className="text-sm" style={{ color: creamDim }}>{label}</span>
    </label>
  );
}

function ProductModal({ product, categories, onSave, onClose }) {
  const [form, setForm] = useState(product || emptyProduct);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(null); // color name or "general"
  const [colorInput, setColorInput] = useState("");
  const [activeColor, setActiveColor] = useState(null);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleImageUpload = async (e, color) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(color);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await adminService.uploadImage(fd);
      if (color === "general") {
        set("images", [...(form.images || []), data.url]);
      } else {
        const existing = form.color_images?.[color] || [];
        set("color_images", { ...(form.color_images || {}), [color]: [...existing, data.url] });
      }
      toast.success("Image uploaded!");
    } catch { toast.error("Upload failed"); }
    finally { setUploading(null); }
  };

  const removeColorImage = (color, url) => {
    const updated = (form.color_images?.[color] || []).filter(u => u !== url);
    set("color_images", { ...(form.color_images || {}), [color]: updated });
  };

  const addColor = () => {
    const trimmed = colorInput.trim();
    if (trimmed && !form.colors.includes(trimmed)) {
      set("colors", [...form.colors, trimmed]);
      set("color_images", { ...(form.color_images || {}), [trimmed]: [] });
      setActiveColor(trimmed);
      setColorInput("");
    }
  };

  const removeColor = (c) => {
    set("colors", form.colors.filter(x => x !== c));
    const ci = { ...(form.color_images || {}) };
    delete ci[c];
    set("color_images", ci);
    const cp = { ...(form.color_prices || {}) };
    delete cp[c];
    set("color_prices", cp);
    if (activeColor === c) setActiveColor(form.colors.find(x => x !== c) || null);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category_id) {
      toast.error("Name, price and category are required");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        ...form,
        price: parseFloat(form.price),
        compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
        category_id: parseInt(form.category_id),
        sale_ends_at: form.sale_ends_at || null,
      });
    } finally { setSaving(false); }
  };

  const labelStyle = { display: "block", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: creamDim, marginBottom: 6 };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col"
        style={{ background: modalBg, border: `1px solid ${border}` }}>

        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
          style={{ background: modalBg, borderBottom: `1px solid ${border}` }}>
          <p className="font-normal text-base" style={{ fontFamily: "Playfair Display, serif", color: cream }}>
            {product ? "Edit Product" : "Add New Product"}
          </p>
          <button onClick={onClose} className="p-1.5 transition-colors" style={{ color: creamDim }}>
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label style={labelStyle}>Product Name *</label>
            <input value={form.name} onChange={e => set("name", e.target.value)}
              style={inputStyle} onFocus={focusGold} onBlur={blurBorder} />
          </div>

          {/* Short Description */}
          <div>
            <label style={labelStyle}>Short Description</label>
            <input value={form.short_description} onChange={e => set("short_description", e.target.value)}
              style={inputStyle} onFocus={focusGold} onBlur={blurBorder} />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)}
              rows={3} className="resize-none"
              style={{ ...inputStyle }} onFocus={focusGold} onBlur={blurBorder} />
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Category *</label>
            <select value={form.category_id} onChange={e => set("category_id", e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }} onFocus={focusGold} onBlur={blurBorder}>
              <option value="">Select category</option>
              {(() => {
                const parents = categories.filter(c => !c.parent_id);
                const children = categories.filter(c => c.parent_id);
                const orphans = children.filter(c => !parents.find(p => p.id === c.parent_id));
                return (
                  <>
                    {parents.map(p => {
                      const subs = children.filter(c => c.parent_id === p.id);
                      return subs.length > 0 ? (
                        <optgroup key={p.id} label={p.name}>
                          {subs.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </optgroup>
                      ) : (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      );
                    })}
                    {orphans.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </>
                );
              })()}
            </select>
          </div>

          {/* Pricing Unit */}
          <div>
            <label style={labelStyle}>Sold By</label>
            <div className="flex gap-2">
              {/* Per Piece button */}
              <button type="button"
                onClick={() => set("pricing_unit", "piece")}
                className="flex-1 py-2 text-xs tracking-wider uppercase transition-all"
                style={{
                  border: `1px solid ${form.pricing_unit === "piece" ? gold : border}`,
                  color: form.pricing_unit === "piece" ? gold : creamDim,
                  background: form.pricing_unit === "piece" ? `${gold}18` : "transparent",
                }}>
                Per Piece
              </button>

              {/* Per Gram dropdown */}
              <select
                value={form.pricing_unit === "gram" ? (form.sizes?.[0] || "") : ""}
                onChange={e => { set("pricing_unit", "gram"); set("sizes", e.target.value ? [e.target.value] : []); }}
                className="flex-1 py-2 text-xs tracking-wider uppercase transition-all"
                style={{
                  border: `1px solid ${form.pricing_unit === "gram" ? gold : border}`,
                  color: form.pricing_unit === "gram" ? gold : creamDim,
                  background: form.pricing_unit === "gram" ? `${gold}18` : "transparent",
                  cursor: "pointer",
                }}>
                <option value="">Per Gram</option>
                {[10, 25, 50, 100, 500].map(g => <option key={g} value={`${g}g`}>{g}g</option>)}
              </select>

              {/* Per Kg dropdown */}
              <select
                value={form.pricing_unit === "kg" ? (form.sizes?.[0] || "") : ""}
                onChange={e => { set("pricing_unit", "kg"); set("sizes", e.target.value ? [e.target.value] : []); }}
                className="flex-1 py-2 text-xs tracking-wider uppercase transition-all"
                style={{
                  border: `1px solid ${form.pricing_unit === "kg" ? gold : border}`,
                  color: form.pricing_unit === "kg" ? gold : creamDim,
                  background: form.pricing_unit === "kg" ? `${gold}18` : "transparent",
                  cursor: "pointer",
                }}>
                <option value="">Per Kg</option>
                {[1, 2, 5].map(k => <option key={k} value={`${k}kg`}>{k}kg</option>)}
              </select>
            </div>
          </div>

          {/* Price + Compare */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>
                Price (₹) * {form.pricing_unit !== "piece" && `— per ${form.pricing_unit}`}
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={form.price}
                onChange={e => { if (/^\d*$/.test(e.target.value)) set("price", e.target.value); }}
                style={inputStyle} onFocus={focusGold} onBlur={blurBorder} />
            </div>
            <div>
              <label style={labelStyle}>Compare Price (₹)</label>
              <input
                type="text"
                inputMode="numeric"
                value={form.compare_price}
                onChange={e => { if (/^\d*$/.test(e.target.value)) set("compare_price", e.target.value); }}
                style={inputStyle} onFocus={focusGold} onBlur={blurBorder} />
            </div>
          </div>

          {/* Stock Quantity */}
          {(() => {
            const selectedCat = categories.find(c => String(c.id) === String(form.category_id));
            const isWeightBased = selectedCat && selectedCat.name.toLowerCase().includes("kundan");
            const weightOptions = [
              { label: "10g",  value: 10 },
              { label: "25g",  value: 25 },
              { label: "50g",  value: 50 },
              { label: "100g", value: 100 },
              { label: "250g", value: 250 },
              { label: "500g", value: 500 },
              { label: "1kg",  value: 1000 },
              { label: "2kg",  value: 2000 },
              { label: "5kg",  value: 5000 },
              { label: "10kg", value: 10000 },
            ];
            return (
              <div>
                <label style={labelStyle}>Stock Quantity</label>
                {isWeightBased ? (
                  <select value={form.stock_quantity || ""} onChange={e => set("stock_quantity", parseInt(e.target.value))}
                    style={{ ...inputStyle, cursor: "pointer" }} onFocus={focusGold} onBlur={blurBorder}>
                    <option value="">Select quantity</option>
                    {weightOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : (
                  <input type="number" value={form.stock_quantity} onChange={e => set("stock_quantity", parseInt(e.target.value) || 0)}
                    style={inputStyle} onFocus={focusGold} onBlur={blurBorder} />
                )}
              </div>
            );
          })()}

          {/* SKU */}
          <div>
            <label style={labelStyle}>SKU</label>
            <input value={form.sku || ""} onChange={e => set("sku", e.target.value)}
              placeholder="Optional" style={inputStyle} onFocus={focusGold} onBlur={blurBorder} />
          </div>

          {/* Colors + Per-color Images */}
          <div className="space-y-3">
            <label style={labelStyle}>Colors & Images</label>

            {/* Add color input */}
            <div className="flex gap-2">
              <input value={colorInput} onChange={e => setColorInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addColor())}
                placeholder="Type a color name and press Enter"
                style={{ ...inputStyle, width: "auto", flex: 1 }} onFocus={focusGold} onBlur={blurBorder} />
              <button onClick={addColor} className="px-4 py-2 text-xs transition-colors"
                style={{ background: `${gold}20`, color: gold, border: `1px solid ${gold}40` }}>
                Add
              </button>
            </div>

            {/* Color tabs */}
            {form.colors.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {form.colors.map(c => (
                  <button key={c} type="button" onClick={() => setActiveColor(c)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs transition-all"
                    style={{
                      border: `1px solid ${activeColor === c ? gold : border}`,
                      color: activeColor === c ? gold : creamDim,
                      background: activeColor === c ? `${gold}18` : "transparent",
                    }}>
                    {c}
                    <span onClick={e => { e.stopPropagation(); removeColor(c); }} style={{ color: creamDim, lineHeight: 1 }}>
                      <X size={10} />
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Images + price for active color */}
            {activeColor && (
              <div style={{ border: `1px solid ${border}`, padding: 12 }}>
                <p className="text-xs mb-3" style={{ color: creamDim }}>
                  Images for <span style={{ color: gold }}>{activeColor}</span>
                </p>
                <div className="mb-3">
                  <label style={{ ...labelStyle, marginBottom: 4 }}>
                    Price for {activeColor} (₹) — leave blank to use base price
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder={`Base: ₹${form.price || "—"}`}
                    value={form.color_prices?.[activeColor] ?? ""}
                    onChange={e => {
                      if (/^\d*$/.test(e.target.value)) {
                        const cp = { ...(form.color_prices || {}) };
                        if (e.target.value === "") delete cp[activeColor];
                        else cp[activeColor] = parseFloat(e.target.value);
                        set("color_prices", cp);
                      }
                    }}
                    style={{ ...inputStyle, width: "50%" }}
                    onFocus={focusGold} onBlur={blurBorder}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(form.color_images?.[activeColor] || []).map((url, i) => (
                    <div key={i} className="relative">
                      <img src={url} alt="" className="w-16 h-16 object-cover" style={{ border: `1px solid ${border}` }} />
                      <button onClick={() => removeColorImage(activeColor, url)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center"
                        style={{ background: "#f87171", color: "#fff", borderRadius: "50%" }}>
                        <X size={9} />
                      </button>
                    </div>
                  ))}
                  <label className="w-16 h-16 flex flex-col items-center justify-center cursor-pointer gap-1"
                    style={{ border: `1px dashed ${uploading === activeColor ? gold : border}` }}>
                    <input type="file" accept="image/*" className="hidden"
                      onChange={e => handleImageUpload(e, activeColor)} />
                    {uploading === activeColor
                      ? <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: gold, borderTopColor: "transparent" }} />
                      : <><Image size={16} style={{ color: creamDim }} /><span className="text-[9px]" style={{ color: creamDim }}>Upload</span></>
                    }
                  </label>
                </div>
              </div>
            )}

            {/* General images (no colors) */}
            {form.colors.length === 0 && (
              <div>
                <p className="text-xs mb-2" style={{ color: creamDim }}>General product images</p>
                <div className="flex gap-2 flex-wrap">
                  {(form.images || []).map((url, i) => (
                    <div key={i} className="relative">
                      <img src={url} alt="" className="w-16 h-16 object-cover" style={{ border: `1px solid ${border}` }} />
                      <button onClick={() => set("images", form.images.filter(x => x !== url))}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center"
                        style={{ background: "#f87171", color: "#fff", borderRadius: "50%" }}>
                        <X size={9} />
                      </button>
                    </div>
                  ))}
                  <label className="w-16 h-16 flex flex-col items-center justify-center cursor-pointer gap-1"
                    style={{ border: `1px dashed ${uploading === "general" ? gold : border}` }}>
                    <input type="file" accept="image/*" className="hidden"
                      onChange={e => handleImageUpload(e, "general")} />
                    {uploading === "general"
                      ? <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: gold, borderTopColor: "transparent" }} />
                      : <><Image size={16} style={{ color: creamDim }} /><span className="text-[9px]" style={{ color: creamDim }}>Upload</span></>
                    }
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Flash Sale */}
          <div>
            <label style={labelStyle}>Flash Sale Ends At (leave blank to disable)</label>
            <input type="datetime-local"
              value={form.sale_ends_at ? new Date(form.sale_ends_at).toISOString().slice(0, 16) : ""}
              onChange={e => set("sale_ends_at", e.target.value || null)}
              style={{ ...inputStyle, colorScheme: "dark" }} onFocus={focusGold} onBlur={blurBorder} />
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            <Toggle value={form.is_featured} onChange={() => set("is_featured", !form.is_featured)} label="Featured" />
            <Toggle value={form.is_bestseller} onChange={() => set("is_bestseller", !form.is_bestseller)} label="Bestseller" />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2" style={{ borderTop: `1px solid ${border}` }}>
            <button onClick={onClose} className="px-5 py-2.5 text-sm transition-colors"
              style={{ border: `1px solid ${border}`, color: creamDim }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="px-5 py-2.5 text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50"
              style={{ background: gold, color: "#0c0a09" }}>
              <Check size={14} /> {saving ? "Saving..." : "Save Product"}
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
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-normal" style={{ fontFamily: "Playfair Display, serif", color: cream }}>Products</h1>
          <p className="text-xs mt-0.5" style={{ color: creamDim }}>{total} total products</p>
        </div>
        <div className="flex items-center gap-2">
          {/* CSV Import */}
          <label className="flex items-center gap-2 px-4 py-2.5 text-xs cursor-pointer transition-colors"
            style={{ border: `1px solid ${border}`, color: creamDim }}>
            <Upload size={13} /> Import CSV
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
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium tracking-widest uppercase transition-all"
            style={{ background: gold, color: "#0c0a09" }}>
            <Plus size={14} /> Add Product
          </button>
        </div>
      </div>

      <p className="text-xs" style={{ color: creamDim }}>
        CSV columns: name, price, category_id, stock_quantity, compare_price, description, short_description, sku, images (|‑separated), colors, sizes
      </p>

      {/* Search */}
      <div className="relative w-full sm:w-72">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: creamDim }} />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search products..."
          className="w-full pl-9 pr-4 py-2.5 text-sm focus:outline-none"
          style={{ background: cardBg, border: `1px solid ${border}`, color: cream }}
          onFocus={focusGold} onBlur={blurBorder} />
      </div>

      {/* Table */}
      <div style={{ background: cardBg, border: `1px solid ${border}` }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {["Product", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs tracking-widest uppercase" style={{ color: creamDim }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${border}` }}>
                    <td colSpan={6} className="px-5 py-4">
                      <div className="h-3 rounded animate-pulse" style={{ background: border }} />
                    </td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-sm" style={{ color: creamDim }}>
                    No products found
                  </td>
                </tr>
              ) : products.map(p => (
                <tr key={p.id} style={{ borderBottom: `1px solid ${border}` }}
                  onMouseEnter={e => e.currentTarget.style.background = "#231f1b"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {p.images?.[0]
                        ? <img src={p.images[0]} alt="" className="w-10 h-10 object-cover flex-shrink-0" style={{ border: `1px solid ${border}` }} />
                        : <div className="w-10 h-10 flex items-center justify-center flex-shrink-0" style={{ background: border }}><Image size={14} style={{ color: creamDim }} /></div>
                      }
                      <div className="min-w-0">
                        <p className="font-medium text-xs truncate max-w-[180px]" style={{ color: cream }}>{p.name}</p>
                        {p.sku && <p className="text-xs" style={{ color: creamDim }}>SKU: {p.sku}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: creamDim }}>{p.category?.name || "—"}</td>
                  <td className="px-5 py-3">
                    <p className="text-xs font-semibold" style={{ color: cream }}>₹{p.price.toLocaleString()}</p>
                    {p.compare_price && <p className="text-xs line-through" style={{ color: creamDim }}>₹{p.compare_price.toLocaleString()}</p>}
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2 py-1"
                      style={{
                        color: p.stock_quantity > 0 ? "#4ade80" : "#f87171",
                        background: p.stock_quantity > 0 ? "#4ade8015" : "#f8717115",
                        border: `1px solid ${p.stock_quantity > 0 ? "#4ade8040" : "#f8717140"}`,
                      }}>
                      {p.stock_quantity} units
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2 py-1 capitalize"
                      style={{
                        color: p.status === "active" ? "#4ade80" : creamDim,
                        background: p.status === "active" ? "#4ade8015" : `${border}50`,
                        border: `1px solid ${p.status === "active" ? "#4ade8040" : border}`,
                      }}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => { setModalProduct(p); setShowModal(true); }}
                        className="p-2 transition-colors" style={{ color: "#60a5fa" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#60a5fa15"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(p.id)}
                        className="p-2 transition-colors" style={{ color: "#f87171" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f8717115"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 20 && (
          <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: `1px solid ${border}` }}>
            <p className="text-xs" style={{ color: creamDim }}>Page {page} of {Math.ceil(total / 20)}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 text-xs disabled:opacity-40 transition-colors"
                style={{ border: `1px solid ${border}`, color: creamDim }}>Prev</button>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 20)}
                className="px-3 py-1.5 text-xs disabled:opacity-40 transition-colors"
                style={{ border: `1px solid ${border}`, color: creamDim }}>Next</button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <ProductModal product={modalProduct} categories={categories} onSave={handleSave} onClose={() => setShowModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
