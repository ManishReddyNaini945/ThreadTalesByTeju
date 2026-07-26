import { useEffect, useState } from "react";
import { Plus, Trash2, Ticket, Power, Pencil, X } from "lucide-react";
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

const selectStyle = { ...inputStyle, appearance: "none", cursor: "pointer" };

const emptyForm = {
  code: "", description: "", discount_type: "percentage", discount_value: "",
  min_order_amount: "", max_discount_amount: "", usage_limit: "",
  starts_at: "", expires_at: "",
};

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function toDateInput(d) {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const load = async () => {
    try {
      const { data } = await adminService.getCoupons();
      setCoupons(data);
    } catch { toast.error("Failed to load coupons"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code.trim() || !form.discount_value) return;
    setSaving(true);
    const payload = {
      code: form.code.trim(),
      description: form.description.trim() || undefined,
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value),
      min_order_amount: form.min_order_amount ? Number(form.min_order_amount) : 0,
      max_discount_amount: form.max_discount_amount ? Number(form.max_discount_amount) : undefined,
      usage_limit: form.usage_limit ? parseInt(form.usage_limit) : undefined,
      starts_at: form.starts_at || undefined,
      expires_at: form.expires_at || undefined,
    };
    try {
      if (editingId) {
        await adminService.updateCoupon(editingId, payload);
        toast.success("Coupon updated!");
      } else {
        await adminService.createCoupon(payload);
        toast.success("Coupon created!");
      }
      cancelEdit();
      load();
    } catch (err) {
      toast.error(err?.response?.data?.detail || `Failed to ${editingId ? "update" : "create"} coupon`);
    } finally { setSaving(false); }
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setForm({
      code: c.code || "",
      description: c.description || "",
      discount_type: c.discount_type || "percentage",
      discount_value: c.discount_value ?? "",
      min_order_amount: c.min_order_amount ?? "",
      max_discount_amount: c.max_discount_amount ?? "",
      usage_limit: c.usage_limit ?? "",
      starts_at: toDateInput(c.starts_at),
      expires_at: toDateInput(c.expires_at),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const toggleActive = async (coupon) => {
    try {
      await adminService.updateCoupon(coupon.id, { is_active: !coupon.is_active });
      setCoupons(prev => prev.map(c => c.id === coupon.id ? { ...c, is_active: !c.is_active } : c));
    } catch { toast.error("Failed to update coupon"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      await adminService.deleteCoupon(id);
      toast.success("Deleted");
      setCoupons(prev => prev.filter(c => c.id !== id));
      if (editingId === id) cancelEdit();
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-normal" style={{ fontFamily: "Playfair Display, serif", color: cream }}>Coupons</h1>
        <p className="text-xs mt-0.5" style={{ color: creamDim }}>{coupons.length} coupons</p>
      </div>

      {/* Create / Edit form */}
      <form onSubmit={handleSubmit} className="p-5 space-y-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
        <p className="text-xs tracking-widest uppercase flex items-center gap-2" style={{ color: gold }}>
          {editingId ? <Pencil size={12} /> : <Plus size={12} />} {editingId ? `Edit Coupon — ${form.code}` : "Add New Coupon"}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: creamDim }}>Code *</label>
            <input value={form.code} onChange={e => set("code", e.target.value.toUpperCase())} placeholder="e.g. TTBT10"
              style={inputStyle} onFocus={e => e.target.style.borderColor = gold} onBlur={e => e.target.style.borderColor = border} />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: creamDim }}>Description</label>
            <input value={form.description} onChange={e => set("description", e.target.value)} placeholder="Optional"
              style={inputStyle} onFocus={e => e.target.style.borderColor = gold} onBlur={e => e.target.style.borderColor = border} />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: creamDim }}>Discount Type</label>
            <select value={form.discount_type} onChange={e => set("discount_type", e.target.value)}
              style={selectStyle} onFocus={e => e.target.style.borderColor = gold} onBlur={e => e.target.style.borderColor = border}>
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: creamDim }}>
              Discount Value * {form.discount_type === "percentage" ? "(%)" : "(₹)"}
            </label>
            <input type="number" min="0" value={form.discount_value} onChange={e => set("discount_value", e.target.value)}
              placeholder={form.discount_type === "percentage" ? "e.g. 10" : "e.g. 100"}
              style={inputStyle} onFocus={e => e.target.style.borderColor = gold} onBlur={e => e.target.style.borderColor = border} />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: creamDim }}>Minimum Order Amount (₹)</label>
            <input type="number" min="0" value={form.min_order_amount} onChange={e => set("min_order_amount", e.target.value)}
              placeholder="e.g. 499"
              style={inputStyle} onFocus={e => e.target.style.borderColor = gold} onBlur={e => e.target.style.borderColor = border} />
          </div>
          {form.discount_type === "percentage" && (
            <div>
              <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: creamDim }}>Max Discount Cap (₹)</label>
              <input type="number" min="0" value={form.max_discount_amount} onChange={e => set("max_discount_amount", e.target.value)}
                placeholder="Optional"
                style={inputStyle} onFocus={e => e.target.style.borderColor = gold} onBlur={e => e.target.style.borderColor = border} />
            </div>
          )}

          <div>
            <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: creamDim }}>Usage Limit</label>
            <input type="number" min="0" value={form.usage_limit} onChange={e => set("usage_limit", e.target.value)}
              placeholder="Optional — unlimited if blank"
              style={inputStyle} onFocus={e => e.target.style.borderColor = gold} onBlur={e => e.target.style.borderColor = border} />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: creamDim }}>Start Date</label>
            <input type="date" value={form.starts_at} onChange={e => set("starts_at", e.target.value)}
              style={{ ...inputStyle, colorScheme: "dark" }} onFocus={e => e.target.style.borderColor = gold} onBlur={e => e.target.style.borderColor = border} />
            <p className="text-[11px] mt-1" style={{ color: creamDim }}>Leave blank to make it active immediately</p>
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: creamDim }}>End Date</label>
            <input type="date" value={form.expires_at} onChange={e => set("expires_at", e.target.value)}
              style={{ ...inputStyle, colorScheme: "dark" }} onFocus={e => e.target.style.borderColor = gold} onBlur={e => e.target.style.borderColor = border} />
            <p className="text-[11px] mt-1" style={{ color: creamDim }}>Leave blank for no expiry</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving || !form.code.trim() || !form.discount_value}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium tracking-widest uppercase transition-all disabled:opacity-50"
            style={{ background: gold, color: "#0c0a09" }}>
            {editingId ? <Pencil size={14} /> : <Plus size={14} />}
            {saving ? (editingId ? "Saving..." : "Creating...") : (editingId ? "Save Changes" : "Create Coupon")}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium tracking-widest uppercase transition-all"
              style={{ border: `1px solid ${border}`, color: creamDim }}>
              <X size={14} /> Cancel
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <div style={{ background: cardBg, border: `1px solid ${border}` }}>
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm" style={{ color: creamDim }}>Loading...</div>
        ) : coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Ticket size={36} style={{ color: border }} />
            <p className="text-sm" style={{ color: creamDim }}>No coupons yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `1px solid ${border}` }}>
                  <th className="text-left px-5 py-3 text-xs tracking-widest uppercase" style={{ color: creamDim }}>Code</th>
                  <th className="text-left px-5 py-3 text-xs tracking-widest uppercase" style={{ color: creamDim }}>Discount</th>
                  <th className="text-left px-5 py-3 text-xs tracking-widest uppercase" style={{ color: creamDim }}>Min Order</th>
                  <th className="text-left px-5 py-3 text-xs tracking-widest uppercase" style={{ color: creamDim }}>Validity</th>
                  <th className="text-left px-5 py-3 text-xs tracking-widest uppercase" style={{ color: creamDim }}>Usage</th>
                  <th className="text-left px-5 py-3 text-xs tracking-widest uppercase" style={{ color: creamDim }}>Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id} style={{ borderBottom: `1px solid ${border}` }}
                    onMouseEnter={e => e.currentTarget.style.background = "#231f1b"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td className="px-5 py-3.5 font-mono font-medium" style={{ color: gold }}>{c.code}</td>
                    <td className="px-5 py-3.5" style={{ color: cream }}>
                      {c.discount_type === "percentage" ? `${c.discount_value}%` : `₹${c.discount_value}`}
                      {c.max_discount_amount ? <span style={{ color: creamDim }}> (max ₹{c.max_discount_amount})</span> : ""}
                    </td>
                    <td className="px-5 py-3.5" style={{ color: creamDim }}>
                      {c.min_order_amount ? `₹${c.min_order_amount}` : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: creamDim }}>
                      {fmtDate(c.starts_at)} → {fmtDate(c.expires_at)}
                    </td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: creamDim }}>
                      {c.used_count}{c.usage_limit ? ` / ${c.usage_limit}` : ""}
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => toggleActive(c)}
                        className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] tracking-wider uppercase"
                        style={{
                          background: c.is_active ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
                          color: c.is_active ? "#4ade80" : "#f87171",
                          border: `1px solid ${c.is_active ? "#4ade80" : "#f87171"}`,
                        }}>
                        <Power size={11} /> {c.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => startEdit(c)}
                          className="p-1.5 transition-colors" style={{ color: "#60a5fa" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(96,165,250,0.1)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(c.id)}
                          className="p-1.5 transition-colors" style={{ color: "#f87171" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.1)"}
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
        )}
      </div>
    </div>
  );
}
