import { useEffect, useState } from "react";
import { Plus, Trash2, Tags } from "lucide-react";
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

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const { data } = await adminService.getCategories();
      setCategories(data);
    } catch { toast.error("Failed to load categories"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await adminService.createCategory({ name: name.trim(), description: description.trim() });
      toast.success("Category created!");
      setName(""); setDescription("");
      load();
    } catch { toast.error("Failed to create"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await adminService.deleteCategory(id);
      toast.success("Deleted");
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="max-w-2xl space-y-6">
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
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Necklaces"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = gold}
            onBlur={e => e.target.style.borderColor = border} />
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: creamDim }}>Description</label>
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional description"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = gold}
            onBlur={e => e.target.style.borderColor = border} />
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
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Tags size={36} style={{ color: border }} />
            <p className="text-sm" style={{ color: creamDim }}>No categories yet</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                <th className="text-left px-5 py-3 text-xs tracking-widest uppercase" style={{ color: creamDim }}>Name</th>
                <th className="text-left px-5 py-3 text-xs tracking-widest uppercase" style={{ color: creamDim }}>Description</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} style={{ borderBottom: `1px solid ${border}` }}
                  onMouseEnter={e => e.currentTarget.style.background = "#231f1b"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td className="px-5 py-4 font-medium" style={{ color: cream }}>{cat.name}</td>
                  <td className="px-5 py-4 text-sm" style={{ color: creamDim }}>{cat.description || "—"}</td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => handleDelete(cat.id)}
                      className="p-1.5 transition-colors" style={{ color: "#f87171" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.1)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
