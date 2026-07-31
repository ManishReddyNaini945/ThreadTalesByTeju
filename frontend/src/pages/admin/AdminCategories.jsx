import { useEffect, useState, useRef, Fragment } from "react";
import { Plus, Trash2, Tags, ChevronRight, Pencil, Check, X, Image as ImageIcon, Upload } from "lucide-react";
import { adminService } from "../../services/adminService";
import { toast } from "sonner";

const gold = "#c8a45c";
const cream = "#f7f5f2";
const creamDim = "#a89f94";
const cardBg = "#1c1916";
const border = "#2d2824";

const inputStyle = {
  width: "100%", padding: "10px 14px",
  background: "#0f0d0c", border: `1px solid ${border}`,
  color: cream, fontSize: 13, outline: "none",
};

const selectStyle = {
  ...inputStyle,
  appearance: "none",
  cursor: "pointer",
};

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editParentId, setEditParentId] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editUploadingImage, setEditUploadingImage] = useState(false);
  const [quickAddParentId, setQuickAddParentId] = useState(null);
  const [quickAddName, setQuickAddName] = useState("");
  const [quickAddSaving, setQuickAddSaving] = useState(false);
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  const uploadCategoryImage = async (file, setUrl, setUploading) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    try {
      const { data } = await adminService.uploadCategoryImage(formData);
      setUrl(data.url);
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const load = async () => {
    try {
      const { data } = await adminService.getCategories();
      setCategories(data);
    } catch { toast.error("Failed to load categories"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  // Top-level categories available as parents
  const topLevel = categories.filter(c => !c.parent_id);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await adminService.createCategory({
        name: name.trim(),
        description: description.trim(),
        parent_id: parentId ? parseInt(parentId) : null,
        image_url: imageUrl || null,
      });
      toast.success("Category created!");
      setName(""); setDescription(""); setParentId(""); setImageUrl("");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to create category");
    } finally { setSaving(false); }
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditDescription(cat.description || "");
    setEditParentId(cat.parent_id ? String(cat.parent_id) : "");
    setEditImageUrl(cat.image_url || "");
  };

  const cancelEdit = () => setEditingId(null);

  const handleUpdate = async (id) => {
    if (!editName.trim()) return;
    try {
      await adminService.updateCategory(id, {
        name: editName.trim(),
        description: editDescription.trim(),
        parent_id: editParentId ? parseInt(editParentId) : null,
        image_url: editImageUrl || null,
      });
      toast.success("Category updated!");
      setEditingId(null);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to update category");
    }
  };

  const startQuickAdd = (parentId) => {
    setQuickAddParentId(parentId);
    setQuickAddName("");
  };

  const cancelQuickAdd = () => {
    setQuickAddParentId(null);
    setQuickAddName("");
  };

  const handleQuickAdd = async (parentId) => {
    if (!quickAddName.trim()) return;
    setQuickAddSaving(true);
    try {
      await adminService.createCategory({ name: quickAddName.trim(), parent_id: parentId });
      toast.success("Subcategory added!");
      cancelQuickAdd();
      load();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to add subcategory");
    } finally { setQuickAddSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await adminService.deleteCategory(id);
      toast.success("Deleted");
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch { toast.error("Failed to delete"); }
  };

  // Group for display: parents first, then children indented
  const grouped = [];
  topLevel.forEach(parent => {
    grouped.push({ ...parent, isParent: true });
    const children = categories.filter(c => c.parent_id === parent.id);
    children.forEach(child => grouped.push({ ...child, isParent: false }));
  });
  // Orphaned children (parent deleted) shown at end
  categories.filter(c => c.parent_id && !topLevel.find(p => p.id === c.parent_id))
    .forEach(c => grouped.push({ ...c, isParent: false }));

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-normal" style={{ fontFamily: "Playfair Display, serif", color: cream }}>Categories</h1>
        <p className="text-xs mt-0.5" style={{ color: creamDim }}>{categories.length} categories</p>
      </div>

      {/* Create form */}
      <form onSubmit={handleCreate} className="p-5 space-y-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
        <p className="text-xs tracking-widest uppercase flex items-center gap-2" style={{ color: gold }}>
          <Plus size={12} /> Add New Category
        </p>
        <div>
          <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: creamDim }}>Name *</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Kundans"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = gold}
            onBlur={e => e.target.style.borderColor = border} />
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: creamDim }}>Parent Category</label>
          <select value={parentId} onChange={e => setParentId(e.target.value)}
            style={selectStyle}
            onFocus={e => e.target.style.borderColor = gold}
            onBlur={e => e.target.style.borderColor = border}>
            <option value="">— None (top-level) —</option>
            {topLevel.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: creamDim }}>Description</label>
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional description"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = gold}
            onBlur={e => e.target.style.borderColor = border} />
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: creamDim }}>
            Image <span style={{ textTransform: "none", letterSpacing: 0 }}>(shown in the homepage Collections section)</span>
          </label>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
            onChange={e => uploadCategoryImage(e.target.files?.[0], setImageUrl, setUploadingImage)} />
          <div className="flex items-center gap-3">
            {imageUrl ? (
              <div className="relative">
                <img src={imageUrl} alt="Category" className="w-16 h-16 object-cover" style={{ border: `1px solid ${border}` }} />
                <button type="button" onClick={() => setImageUrl("")}
                  className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full"
                  style={{ background: "#f87171", color: "#0c0a09" }}>
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div className="w-16 h-16 flex items-center justify-center" style={{ border: `1px dashed ${border}` }}>
                <ImageIcon size={20} style={{ color: creamDim }} />
              </div>
            )}
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage}
              className="flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase disabled:opacity-50"
              style={{ border: `1px solid ${border}`, color: creamDim }}>
              <Upload size={12} /> {uploadingImage ? "Uploading..." : "Upload Image"}
            </button>
          </div>
        </div>
        <button type="submit" disabled={saving || !name.trim()}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium tracking-widest uppercase transition-all disabled:opacity-50"
          style={{ background: gold, color: "#0c0a09" }}>
          <Plus size={14} /> {saving ? "Creating..." : "Create Category"}
        </button>
      </form>

      {/* List */}
      <div style={{ background: cardBg, border: `1px solid ${border}` }}>
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm" style={{ color: creamDim }}>Loading...</div>
        ) : grouped.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Tags size={36} style={{ color: border }} />
            <p className="text-sm" style={{ color: creamDim }}>No categories yet</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                <th className="px-5 py-3" />
                <th className="text-left px-5 py-3 text-xs tracking-widest uppercase" style={{ color: creamDim }}>Name</th>
                <th className="text-left px-5 py-3 text-xs tracking-widest uppercase" style={{ color: creamDim }}>Description</th>
                <th className="text-left px-5 py-3 text-xs tracking-widest uppercase" style={{ color: creamDim }}>Slug</th>
                <th className="text-left px-5 py-3 text-xs tracking-widest uppercase" style={{ color: creamDim }}>Subcategories</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {grouped.map((cat) => {
                const isEditing = editingId === cat.id;
                const childCount = cat.isParent ? categories.filter(c => c.parent_id === cat.id).length : 0;
                const rowInputStyle = {
                  ...inputStyle,
                  padding: "6px 10px",
                  fontSize: 12,
                };
                return (
                  <Fragment key={cat.id}>
                  <tr style={{ borderBottom: `1px solid ${border}`, background: isEditing ? "#1a1614" : "transparent" }}
                    onMouseEnter={e => { if (!isEditing) e.currentTarget.style.background = "#231f1b"; }}
                    onMouseLeave={e => { if (!isEditing) e.currentTarget.style.background = "transparent"; }}>

                    {/* Image */}
                    <td className="px-5 py-3.5">
                      {isEditing ? (
                        <>
                          <input ref={editFileInputRef} type="file" accept="image/*" className="hidden"
                            onChange={e => uploadCategoryImage(e.target.files?.[0], setEditImageUrl, setEditUploadingImage)} />
                          <button type="button" onClick={() => editFileInputRef.current?.click()} disabled={editUploadingImage}
                            className="relative block">
                            {editImageUrl ? (
                              <img src={editImageUrl} alt="" className="w-9 h-9 object-cover" style={{ border: `1px solid ${border}` }} />
                            ) : (
                              <div className="w-9 h-9 flex items-center justify-center" style={{ border: `1px dashed ${border}` }}>
                                <Upload size={12} style={{ color: creamDim }} />
                              </div>
                            )}
                          </button>
                        </>
                      ) : cat.image_url ? (
                        <img src={cat.image_url} alt="" className="w-9 h-9 object-cover" style={{ border: `1px solid ${border}` }} />
                      ) : (
                        <div className="w-9 h-9 flex items-center justify-center" style={{ border: `1px dashed ${border}` }}>
                          <ImageIcon size={12} style={{ color: creamDim }} />
                        </div>
                      )}
                    </td>

                    {/* Name */}
                    <td className="px-5 py-3.5 font-medium" style={{ color: cream }}>
                      {isEditing ? (
                        <input
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && handleUpdate(cat.id)}
                          style={rowInputStyle}
                          onFocus={e => e.target.style.borderColor = gold}
                          onBlur={e => e.target.style.borderColor = border}
                          autoFocus
                        />
                      ) : (
                        <>
                          {!cat.isParent && cat.parent_id && (
                            <ChevronRight size={12} className="inline mr-1" style={{ color: gold, opacity: 0.6 }} />
                          )}
                          <span style={{ color: cat.isParent ? gold : cream, fontWeight: cat.isParent ? 500 : 400 }}>
                            {cat.name}
                          </span>
                        </>
                      )}
                    </td>

                    {/* Description */}
                    <td className="px-5 py-3.5 text-sm" style={{ color: creamDim }}>
                      {isEditing ? (
                        <input
                          value={editDescription}
                          onChange={e => setEditDescription(e.target.value)}
                          placeholder="Optional"
                          style={rowInputStyle}
                          onFocus={e => e.target.style.borderColor = gold}
                          onBlur={e => e.target.style.borderColor = border}
                        />
                      ) : (
                        cat.description || "—"
                      )}
                    </td>

                    {/* Slug / Parent */}
                    <td className="px-5 py-3.5 text-xs font-mono" style={{ color: creamDim }}>
                      {isEditing ? (
                        <select
                          value={editParentId}
                          onChange={e => setEditParentId(e.target.value)}
                          style={{ ...rowInputStyle, fontFamily: "inherit", cursor: "pointer" }}
                          onFocus={e => e.target.style.borderColor = gold}
                          onBlur={e => e.target.style.borderColor = border}>
                          <option value="">— None (top-level) —</option>
                          {topLevel.filter(p => p.id !== cat.id).map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      ) : (
                        cat.slug
                      )}
                    </td>

                    {/* Subcategories */}
                    <td className="px-5 py-3.5 text-xs" style={{ color: creamDim }}>
                      {cat.isParent ? (
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5" style={{ background: `${gold}15`, color: gold, border: `1px solid ${gold}40` }}>
                            {childCount} subcategor{childCount === 1 ? "y" : "ies"}
                          </span>
                          <button type="button" onClick={() => startQuickAdd(cat.id)} title="Add subcategory"
                            className="p-1 transition-colors" style={{ color: "#60a5fa" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(96,165,250,0.1)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            <Plus size={12} />
                          </button>
                        </div>
                      ) : "—"}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {isEditing ? (
                          <>
                            <button onClick={() => handleUpdate(cat.id)}
                              className="p-1.5 transition-colors" style={{ color: "#4ade80" }}
                              onMouseEnter={e => e.currentTarget.style.background = "rgba(74,222,128,0.1)"}
                              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                              <Check size={14} />
                            </button>
                            <button onClick={cancelEdit}
                              className="p-1.5 transition-colors" style={{ color: creamDim }}
                              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(cat)}
                              className="p-1.5 transition-colors" style={{ color: "#60a5fa" }}
                              onMouseEnter={e => e.currentTarget.style.background = "rgba(96,165,250,0.1)"}
                              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                              <Pencil size={14} />
                            </button>
                            <button onClick={() => handleDelete(cat.id)}
                              className="p-1.5 transition-colors" style={{ color: "#f87171" }}
                              onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.1)"}
                              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  {quickAddParentId === cat.id && (
                    <tr style={{ borderBottom: `1px solid ${border}`, background: "#1a1614" }}>
                      <td colSpan={6} className="px-5 py-3">
                        <div className="flex items-center gap-2 pl-6">
                          <ChevronRight size={12} style={{ color: gold, opacity: 0.6 }} />
                          <input
                            value={quickAddName}
                            onChange={e => setQuickAddName(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleQuickAdd(cat.id)}
                            placeholder={`New subcategory under ${cat.name}`}
                            style={{ ...rowInputStyle, flex: 1 }}
                            onFocus={e => e.target.style.borderColor = gold}
                            onBlur={e => e.target.style.borderColor = border}
                            autoFocus
                          />
                          <button onClick={() => handleQuickAdd(cat.id)} disabled={quickAddSaving || !quickAddName.trim()}
                            className="p-1.5 transition-colors disabled:opacity-50" style={{ color: "#4ade80" }}>
                            <Check size={14} />
                          </button>
                          <button onClick={cancelQuickAdd}
                            className="p-1.5 transition-colors" style={{ color: creamDim }}>
                            <X size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
