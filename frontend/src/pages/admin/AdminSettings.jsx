import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Save, ToggleLeft, ToggleRight, Percent, Tag, Zap, RefreshCw, Upload, Image as ImageIcon, X } from "lucide-react";
import api from "../../services/api";

const gold = "#c8a45c";
const cream = "#f7f5f2";
const creamDim = "#a89f94";
const border = "#2d2824";
const card = "#1c1916";
const green = "#4ade80";
const red = "#f87171";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    enabled: true,
    threshold: 999,
    discount_pct: 15,
    label: "15% OFF + FREE SHIPPING",
  });

  const [rakhiForm, setRakhiForm] = useState({ enabled: false, image_url: "" });
  const [rakhiSaving, setRakhiSaving] = useState(false);
  const [rakhiUploading, setRakhiUploading] = useState(false);
  const rakhiFileInputRef = useRef(null);

  useEffect(() => {
    api.get("/settings/promo")
      .then(({ data }) => setForm({
        enabled:      data.enabled,
        threshold:    data.threshold,
        discount_pct: data.discount_pct,
        label:        data.label,
      }))
      .catch(() => toast.error("Failed to load settings"))
      .finally(() => setLoading(false));

    api.get("/settings/rakhi-banner")
      .then(({ data }) => setRakhiForm({ enabled: data.enabled, image_url: data.image_url || "" }))
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/settings/promo", form);
      toast.success("Settings saved successfully!");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleRakhiImageUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setRakhiUploading(true);
    try {
      const { data } = await api.post("/admin/settings/upload-banner-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setRakhiForm(f => ({ ...f, image_url: data.url }));
    } catch {
      toast.error("Image upload failed");
    } finally {
      setRakhiUploading(false);
    }
  };

  const handleSaveRakhiBanner = async () => {
    setRakhiSaving(true);
    try {
      await api.put("/settings/rakhi-banner", rakhiForm);
      toast.success("Rakhi banner saved successfully!");
    } catch {
      toast.error("Failed to save Rakhi banner");
    } finally {
      setRakhiSaving(false);
    }
  };

  const previewDiscount = form.threshold * (form.discount_pct / 100);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <RefreshCw size={24} className="animate-spin" style={{ color: gold }} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-normal mb-1"
          style={{ fontFamily: "Playfair Display, serif", color: cream }}>
          Promo Settings
        </h1>
        <p className="text-sm" style={{ color: creamDim }}>
          Control the automatic order discount shown to customers on the website.
        </p>
      </div>

      {/* Main settings card */}
      <div className="p-6 space-y-6" style={{ background: card, border: `1px solid ${border}` }}>

        {/* Enable / Disable toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-0.5" style={{ color: cream }}>Enable Promo</p>
            <p className="text-xs" style={{ color: creamDim }}>
              Turn the offer on or off site-wide instantly
            </p>
          </div>
          <button
            onClick={() => setForm(f => ({ ...f, enabled: !f.enabled }))}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all"
            style={{
              background: form.enabled ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.1)",
              border: `1px solid ${form.enabled ? "rgba(74,222,128,0.4)" : "rgba(248,113,113,0.4)"}`,
              color: form.enabled ? green : red,
            }}
          >
            {form.enabled
              ? <><ToggleRight size={16} /> Active</>
              : <><ToggleLeft size={16} /> Inactive</>
            }
          </button>
        </div>

        <div style={{ borderTop: `1px solid ${border}` }} />

        {/* Threshold */}
        <div>
          <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: creamDim }}>
            Minimum Order Amount (₹)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium"
              style={{ color: creamDim }}>₹</span>
            <input
              type="number"
              min={0}
              step={1}
              value={form.threshold}
              onChange={e => setForm(f => ({ ...f, threshold: parseFloat(e.target.value) || 0 }))}
              className="w-full pl-7 pr-4 py-3 text-sm focus:outline-none"
              style={{ background: "var(--bg)", border: `1px solid ${border}`, color: cream,
                caretColor: gold }}
              onFocus={e => e.target.style.borderColor = gold}
              onBlur={e => e.target.style.borderColor = border}
            />
          </div>
          <p className="text-xs mt-1.5" style={{ color: creamDim }}>
            Customers who spend this amount or more will get the discount automatically.
          </p>
        </div>

        {/* Discount % */}
        <div>
          <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: creamDim }}>
            Discount Percentage (%)
          </label>
          <div className="relative">
            <Percent size={13} className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: creamDim }} />
            <input
              type="number"
              min={1}
              max={100}
              step={1}
              value={form.discount_pct}
              onChange={e => setForm(f => ({ ...f, discount_pct: parseFloat(e.target.value) || 0 }))}
              className="w-full pl-4 pr-9 py-3 text-sm focus:outline-none"
              style={{ background: "var(--bg)", border: `1px solid ${border}`, color: cream,
                caretColor: gold }}
              onFocus={e => e.target.style.borderColor = gold}
              onBlur={e => e.target.style.borderColor = border}
            />
          </div>
        </div>

        {/* Banner label */}
        <div>
          <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: creamDim }}>
            Banner Text
          </label>
          <div className="relative">
            <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: creamDim }} />
            <input
              type="text"
              maxLength={60}
              value={form.label}
              onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
              placeholder="e.g. 15% OFF + FREE SHIPPING"
              className="w-full pl-9 pr-4 py-3 text-sm focus:outline-none"
              style={{ background: "var(--bg)", border: `1px solid ${border}`, color: cream,
                caretColor: gold }}
              onFocus={e => e.target.style.borderColor = gold}
              onBlur={e => e.target.style.borderColor = border}
            />
          </div>
          <p className="text-xs mt-1.5" style={{ color: creamDim }}>
            This text appears in the offer banner and mobile offer card.
          </p>
        </div>
      </div>

      {/* Live Preview */}
      <div className="p-5" style={{ background: card, border: `1px solid ${border}` }}>
        <p className="text-xs tracking-widest uppercase mb-4" style={{ color: creamDim }}>
          Live Preview
        </p>

        {/* Navbar banner preview */}
        <div className="mb-3 px-4 py-2.5 flex items-center justify-center gap-2"
          style={{
            background: "linear-gradient(90deg, #0c0a09 0%, #1c1810 35%, #1c1810 65%, #0c0a09 100%)",
            border: `1px solid rgba(200,164,92,0.25)`,
            opacity: form.enabled ? 1 : 0.4,
          }}>
          <Zap size={11} style={{ color: gold }} />
          <p className="text-xs text-center" style={{ color: creamDim }}>
            <span className="font-bold" style={{ color: gold }}>{form.label || "—"}</span>
            <span style={{ color: "rgba(200,164,92,0.4)" }}> · </span>
            <span>orders above </span>
            <span className="font-semibold" style={{ color: cream }}>₹{form.threshold.toLocaleString()}</span>
            <span style={{ color: "rgba(200,164,92,0.4)" }}> · </span>
            <span style={{ color: gold, textDecoration: "underline" }}>Shop Now →</span>
          </p>
        </div>
        <p className="text-xs text-center mb-4" style={{ color: creamDim }}>↑ Desktop navbar banner</p>

        {/* Mobile card preview */}
        <div className="mx-auto max-w-sm"
          style={{
            background: "linear-gradient(135deg, #1a1508, #1e1912)",
            border: `1px solid rgba(200,164,92,0.25)`,
            opacity: form.enabled ? 1 : 0.4,
          }}>
          <div className="flex items-center gap-4 px-4 py-4">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center"
              style={{ border: "1px solid rgba(200,164,92,0.4)", background: "rgba(200,164,92,0.08)" }}>
              <Zap size={16} style={{ color: gold }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] tracking-widest uppercase mb-0.5" style={{ color: creamDim }}>
                Limited Offer
              </p>
              <p className="text-sm font-semibold" style={{ color: gold, fontFamily: "Playfair Display, serif" }}>
                {form.label || "—"}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: creamDim }}>
                On orders above{" "}
                <span style={{ color: cream, fontWeight: 600 }}>₹{form.threshold.toLocaleString()}</span>
                {" · "}Auto-applied
              </p>
            </div>
          </div>
        </div>
        <p className="text-xs text-center mt-2" style={{ color: creamDim }}>↑ Mobile hero card</p>

        {/* Savings example */}
        {form.enabled && form.threshold > 0 && form.discount_pct > 0 && (
          <div className="mt-4 p-3 text-center"
            style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)" }}>
            <p className="text-xs" style={{ color: creamDim }}>
              A customer spending{" "}
              <span style={{ color: cream, fontWeight: 600 }}>₹{form.threshold.toLocaleString()}</span>
              {" "}saves{" "}
              <span style={{ color: green, fontWeight: 700 }}>₹{previewDiscount.toLocaleString()}</span>
              {" "}+ gets free shipping
            </p>
          </div>
        )}
        {!form.enabled && (
          <div className="mt-4 p-3 text-center"
            style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)" }}>
            <p className="text-xs" style={{ color: red }}>
              Promo is currently <strong>disabled</strong> — banner will be hidden from customers
            </p>
          </div>
        )}
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-medium tracking-widest uppercase transition-all disabled:opacity-60"
        style={{ background: gold, color: "#0c0a09" }}
      >
        <Save size={15} />
        {saving ? "Saving..." : "Save Settings"}
      </button>

      {/* Rakhi Homepage Banner */}
      <div>
        <h1 className="text-2xl font-normal mb-1"
          style={{ fontFamily: "Playfair Display, serif", color: cream }}>
          Rakhi Homepage Banner
        </h1>
        <p className="text-sm" style={{ color: creamDim }}>
          Upload a festive banner shown on the homepage, above "Our Collections". Links to the /rakhi page.
        </p>
      </div>

      <div className="p-6 space-y-6" style={{ background: card, border: `1px solid ${border}` }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-0.5" style={{ color: cream }}>Show Banner</p>
            <p className="text-xs" style={{ color: creamDim }}>
              Turn the homepage Rakhi banner on or off instantly
            </p>
          </div>
          <button
            onClick={() => setRakhiForm(f => ({ ...f, enabled: !f.enabled }))}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all"
            style={{
              background: rakhiForm.enabled ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.1)",
              border: `1px solid ${rakhiForm.enabled ? "rgba(74,222,128,0.4)" : "rgba(248,113,113,0.4)"}`,
              color: rakhiForm.enabled ? green : red,
            }}
          >
            {rakhiForm.enabled
              ? <><ToggleRight size={16} /> Active</>
              : <><ToggleLeft size={16} /> Inactive</>
            }
          </button>
        </div>

        <div style={{ borderTop: `1px solid ${border}` }} />

        <div>
          <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: creamDim }}>
            Banner Image
          </label>
          <input ref={rakhiFileInputRef} type="file" accept="image/*" className="hidden"
            onChange={e => handleRakhiImageUpload(e.target.files?.[0])} />
          {rakhiForm.image_url ? (
            <div className="relative inline-block">
              <img src={rakhiForm.image_url} alt="Rakhi banner" className="max-w-full"
                style={{ maxHeight: 160, border: `1px solid ${border}` }} />
              <button type="button" onClick={() => setRakhiForm(f => ({ ...f, image_url: "" }))}
                className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full"
                style={{ background: red, color: "#0c0a09" }}>
                <X size={13} />
              </button>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center py-10" style={{ border: `1px dashed ${border}` }}>
              <ImageIcon size={28} style={{ color: creamDim }} />
            </div>
          )}
          <button type="button" onClick={() => rakhiFileInputRef.current?.click()} disabled={rakhiUploading}
            className="mt-3 flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase disabled:opacity-50"
            style={{ border: `1px solid ${border}`, color: creamDim }}>
            <Upload size={12} /> {rakhiUploading ? "Uploading..." : rakhiForm.image_url ? "Replace Image" : "Upload Image"}
          </button>
          <p className="text-xs mt-2" style={{ color: creamDim }}>
            Recommended: a wide festive image (e.g. 1600×500px) with "Celebrate Raksha Bandhan · Flat 25% OFF" already designed into it.
          </p>
        </div>

        {rakhiForm.enabled && !rakhiForm.image_url && (
          <div className="p-3 text-center" style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)" }}>
            <p className="text-xs" style={{ color: red }}>
              Banner is set to Active but no image is uploaded — it won't show on the homepage until you add one.
            </p>
          </div>
        )}
      </div>

      <button
        onClick={handleSaveRakhiBanner}
        disabled={rakhiSaving}
        className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-medium tracking-widest uppercase transition-all disabled:opacity-60"
        style={{ background: gold, color: "#0c0a09" }}
      >
        <Save size={15} />
        {rakhiSaving ? "Saving..." : "Save Rakhi Banner"}
      </button>
    </div>
  );
}
