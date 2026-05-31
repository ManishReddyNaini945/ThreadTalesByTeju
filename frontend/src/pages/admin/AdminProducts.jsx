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
  category_id: "", stock_quantity: 0, sku: "", images: [], colors: [], color_images: {}, color_prices: {}, color_names: {}, image_types: {}, sizes: [],
  size_prices: {},
  tags: [], is_featured: false, is_bestseller: false, sale_ends_at: "",
  pricing_unit: "piece",
};

const ML_OPTIONS = ["50ml", "100ml", "150ml", "200ml", "250ml", "500ml", "1000ml"];
const METRE_OPTIONS = ["1 Metre", "5 Metre", "10 Metre"];
const BANGLE_OPTIONS = ["2-2", "2-4", "2-6", "2-8"];
const PIECE_OPTIONS = ["5", "10", "25", "50", "100"];

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
  const [customMlInput, setCustomMlInput] = useState("");
  const [customMetreInput, setCustomMetreInput] = useState("");

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
    const cn = { ...(form.color_names || {}) };
    delete cn[c];
    set("color_names", cn);
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
            <select value={form.category_id} onChange={e => {
              const newCatId = e.target.value;
              const selectedCat = categories.find(c => String(c.id) === String(newCatId));
              const isBangles = selectedCat?.name?.toLowerCase().includes("bangle");
              setForm(f => ({
                ...f,
                category_id: newCatId,
                pricing_unit: isBangles ? "piece" : (["box","bangle"].includes(f.pricing_unit) ? "piece" : f.pricing_unit),
              }));
            }}
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
          {(() => {
            const selectedCatForUnit = categories.find(c => String(c.id) === String(form.category_id));
            const isBanglesCategory = selectedCatForUnit?.name?.toLowerCase().includes("bangle");
            const isGluesCategory = selectedCatForUnit?.name?.toLowerCase().includes("glue");
            const isChainsCategory = selectedCatForUnit?.name?.toLowerCase().includes("chain");
            return (
              <div>
                <label style={labelStyle}>Sold By</label>
                <div className="flex gap-2">
                  {isBanglesCategory ? (
                    <>
                      <button type="button"
                        onClick={() => { set("pricing_unit", "piece"); set("sizes", []); set("size_prices", {}); }}
                        className="flex-1 py-2 text-xs tracking-wider uppercase transition-all"
                        style={{
                          border: `1px solid ${form.pricing_unit === "piece" ? gold : border}`,
                          color: form.pricing_unit === "piece" ? gold : creamDim,
                          background: form.pricing_unit === "piece" ? `${gold}18` : "transparent",
                        }}>
                        Fixed Price
                      </button>
                      <button type="button"
                        onClick={() => set("pricing_unit", "bangle")}
                        className="flex-1 py-2 text-xs tracking-wider uppercase transition-all"
                        style={{
                          border: `1px solid ${form.pricing_unit === "bangle" ? gold : border}`,
                          color: form.pricing_unit === "bangle" ? gold : creamDim,
                          background: form.pricing_unit === "bangle" ? `${gold}18` : "transparent",
                        }}>
                        Per Size
                      </button>
                    </>
                  ) : isGluesCategory ? (
                    <>
                      <button type="button"
                        onClick={() => { set("pricing_unit", "piece"); set("sizes", []); set("size_prices", {}); }}
                        className="flex-1 py-2 text-xs tracking-wider uppercase transition-all"
                        style={{
                          border: `1px solid ${form.pricing_unit === "piece" ? gold : border}`,
                          color: form.pricing_unit === "piece" ? gold : creamDim,
                          background: form.pricing_unit === "piece" ? `${gold}18` : "transparent",
                        }}>
                        Fixed Price
                      </button>
                      <button type="button"
                        onClick={() => set("pricing_unit", "ml")}
                        className="flex-1 py-2 text-xs tracking-wider uppercase transition-all"
                        style={{
                          border: `1px solid ${form.pricing_unit === "ml" ? gold : border}`,
                          color: form.pricing_unit === "ml" ? gold : creamDim,
                          background: form.pricing_unit === "ml" ? `${gold}18` : "transparent",
                        }}>
                        Per ML (size-wise)
                      </button>
                    </>
                  ) : isChainsCategory ? (
                    <>
                      <button type="button"
                        onClick={() => { set("pricing_unit", "piece"); set("sizes", []); set("size_prices", {}); }}
                        className="flex-1 py-2 text-xs tracking-wider uppercase transition-all"
                        style={{
                          border: `1px solid ${form.pricing_unit === "piece" ? gold : border}`,
                          color: form.pricing_unit === "piece" ? gold : creamDim,
                          background: form.pricing_unit === "piece" ? `${gold}18` : "transparent",
                        }}>
                        Fixed Price
                      </button>
                      <button type="button"
                        onClick={() => set("pricing_unit", "metre")}
                        className="flex-1 py-2 text-xs tracking-wider uppercase transition-all"
                        style={{
                          border: `1px solid ${form.pricing_unit === "metre" ? gold : border}`,
                          color: form.pricing_unit === "metre" ? gold : creamDim,
                          background: form.pricing_unit === "metre" ? `${gold}18` : "transparent",
                        }}>
                        Per Metre
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Per Piece button */}
                      <button type="button"
                        onClick={() => { set("pricing_unit", "piece"); set("sizes", []); set("size_prices", {}); }}
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
                        {[5, 10, 25, 50, 100, 500].map(g => <option key={g} value={`${g}g`}>{g}g</option>)}
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
                    </>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Piece Sizes + per-size prices (general piece products) */}
          {(() => {
            const selectedCatForPiece = categories.find(c => String(c.id) === String(form.category_id));
            const catName = selectedCatForPiece?.name?.toLowerCase() || "";
            if (form.pricing_unit !== "piece") return null;
            if (catName.includes("bangle") || catName.includes("glue") || catName.includes("chain")) return null;

            const allPieceOptions = [
              ...PIECE_OPTIONS,
              ...((form.sizes || []).filter(s => !PIECE_OPTIONS.includes(s))),
            ];

            const togglePiece = (size) => {
              const isSelected = (form.sizes || []).includes(size);
              const newSizes = isSelected
                ? (form.sizes || []).filter(s => s !== size)
                : [...(form.sizes || []), size];
              set("sizes", newSizes);
              if (isSelected) {
                const sp = { ...(form.size_prices || {}) };
                delete sp[size];
                set("size_prices", sp);
              }
            };

            return (
              <div className="space-y-3">
                <label style={labelStyle}>Piece Options & Prices</label>
                <p className="text-xs" style={{ color: creamDim }}>
                  Select piece counts and set a price for each. Leave unselected for a single fixed price.
                </p>

                <div className="grid grid-cols-4 gap-2">
                  {allPieceOptions.map(size => {
                    const isSelected = (form.sizes || []).includes(size);
                    const isCustom = !PIECE_OPTIONS.includes(size);
                    return (
                      <div key={size} className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => togglePiece(size)}
                          className="w-full py-2 text-xs tracking-wider transition-all relative"
                          style={{
                            border: `1px solid ${isSelected ? gold : border}`,
                            color: isSelected ? gold : creamDim,
                            background: isSelected ? `${gold}18` : "transparent",
                          }}>
                          {size}
                          {isCustom && (
                            <span
                              onClick={e => {
                                e.stopPropagation();
                                const newSizes = (form.sizes || []).filter(s => s !== size);
                                const sp = { ...(form.size_prices || {}) };
                                delete sp[size];
                                set("sizes", newSizes);
                                set("size_prices", sp);
                              }}
                              className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center"
                              style={{ background: "#f87171", borderRadius: "50%", color: "#fff" }}>
                              <X size={8} />
                            </span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Custom piece input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customMlInput}
                    onChange={e => setCustomMlInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const val = customMlInput.trim();
                        if (val && !(form.sizes || []).includes(val)) set("sizes", [...(form.sizes || []), val]);
                        setCustomMlInput("");
                      }
                    }}
                    placeholder="Custom (e.g. 3 Pieces, Set of 6, Pair)"
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={focusGold} onBlur={blurBorder}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = customMlInput.trim();
                      if (val && !(form.sizes || []).includes(val)) set("sizes", [...(form.sizes || []), val]);
                      setCustomMlInput("");
                    }}
                    className="px-4 py-2 text-xs transition-colors"
                    style={{ background: `${gold}20`, color: gold, border: `1px solid ${gold}40` }}>
                    Add
                  </button>
                </div>

                {/* Price inputs for selected sizes */}
                {(form.sizes || []).length > 0 && (
                  <div className="space-y-2" style={{ borderTop: `1px solid ${border}`, paddingTop: 12 }}>
                    <p className="text-xs" style={{ color: creamDim }}>Set price for each option:</p>
                    {(form.sizes || []).map(size => (
                      <div key={size} className="flex items-center gap-3">
                        <span className="text-xs font-medium w-24 flex-shrink-0" style={{ color: gold }}>{size}</span>
                        <span className="text-xs" style={{ color: creamDim }}>₹</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="Price"
                          value={form.size_prices?.[size] ?? ""}
                          onChange={e => {
                            if (/^\d*$/.test(e.target.value)) {
                              const sp = { ...(form.size_prices || {}) };
                              if (e.target.value === "") delete sp[size];
                              else sp[size] = parseFloat(e.target.value);
                              set("size_prices", sp);
                            }
                          }}
                          style={{ ...inputStyle, width: 120 }}
                          onFocus={focusGold} onBlur={blurBorder}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ML Sizes + per-size prices (glues only) */}
          {(() => {
            const selectedCatForMl = categories.find(c => String(c.id) === String(form.category_id));
            if (!selectedCatForMl?.name?.toLowerCase().includes("glue")) return null;

            const allMlOptions = [
              ...ML_OPTIONS,
              ...((form.sizes || []).filter(s => !ML_OPTIONS.includes(s))),
            ];

            const toggleMl = (ml) => {
              const isSelected = (form.sizes || []).includes(ml);
              const newSizes = isSelected
                ? (form.sizes || []).filter(s => s !== ml)
                : [...(form.sizes || []), ml];
              set("sizes", newSizes);
              if (isSelected) {
                const sp = { ...(form.size_prices || {}) };
                delete sp[ml];
                set("size_prices", sp);
              }
            };

            const addCustomMl = () => {
              const val = customMlInput.trim().toLowerCase().replace(/\s+/g, "");
              if (!val) return;
              const normalized = val.endsWith("ml") ? val : `${val}ml`;
              if (!(form.sizes || []).includes(normalized)) {
                set("sizes", [...(form.sizes || []), normalized]);
              }
              setCustomMlInput("");
            };

            return (
              <div className="space-y-3">
                <label style={labelStyle}>ML Sizes & Prices</label>
                <p className="text-xs" style={{ color: creamDim }}>
                  Click a size to select it, then enter its price below.
                </p>

                {/* Grid of ML option buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {allMlOptions.map(ml => {
                    const isSelected = (form.sizes || []).includes(ml);
                    const isCustom = !ML_OPTIONS.includes(ml);
                    return (
                      <div key={ml} className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => toggleMl(ml)}
                          className="w-full py-2 text-xs tracking-wider uppercase transition-all relative"
                          style={{
                            border: `1px solid ${isSelected ? gold : border}`,
                            color: isSelected ? gold : creamDim,
                            background: isSelected ? `${gold}18` : "transparent",
                          }}>
                          {ml}
                          {isCustom && (
                            <span
                              onClick={e => {
                                e.stopPropagation();
                                const newSizes = (form.sizes || []).filter(s => s !== ml);
                                const sp = { ...(form.size_prices || {}) };
                                delete sp[ml];
                                set("sizes", newSizes);
                                set("size_prices", sp);
                              }}
                              className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center"
                              style={{ background: "#f87171", borderRadius: "50%", color: "#fff" }}>
                              <X size={8} />
                            </span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Custom ML input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customMlInput}
                    onChange={e => setCustomMlInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCustomMl())}
                    placeholder="Custom ml (e.g. 300)"
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={focusGold} onBlur={blurBorder}
                  />
                  <button
                    type="button"
                    onClick={addCustomMl}
                    className="px-4 py-2 text-xs transition-colors"
                    style={{ background: `${gold}20`, color: gold, border: `1px solid ${gold}40` }}>
                    Add
                  </button>
                </div>

                {/* Price inputs for selected sizes */}
                {(form.sizes || []).length > 0 && (
                  <div className="space-y-2" style={{ borderTop: `1px solid ${border}`, paddingTop: 12 }}>
                    <p className="text-xs" style={{ color: creamDim }}>Set price for each selected size:</p>
                    {(form.sizes || []).map(ml => (
                      <div key={ml} className="flex items-center gap-3">
                        <span className="text-xs font-medium w-16 uppercase tracking-wider flex-shrink-0" style={{ color: gold }}>{ml}</span>
                        <span className="text-xs" style={{ color: creamDim }}>₹</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="Price"
                          value={form.size_prices?.[ml] ?? ""}
                          onChange={e => {
                            if (/^\d*$/.test(e.target.value)) {
                              const sp = { ...(form.size_prices || {}) };
                              if (e.target.value === "") delete sp[ml];
                              else sp[ml] = parseFloat(e.target.value);
                              set("size_prices", sp);
                            }
                          }}
                          style={{ ...inputStyle, width: 120 }}
                          onFocus={focusGold} onBlur={blurBorder}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Metre Sizes + per-size prices (chains only) */}
          {(() => {
            const selectedCatForMetre = categories.find(c => String(c.id) === String(form.category_id));
            if (!selectedCatForMetre?.name?.toLowerCase().includes("chain")) return null;
            if (form.pricing_unit !== "metre") return null;

            const allMetreOptions = [
              ...METRE_OPTIONS,
              ...((form.sizes || []).filter(s => !METRE_OPTIONS.includes(s))),
            ];

            const toggleMetre = (m) => {
              const isSelected = (form.sizes || []).includes(m);
              const newSizes = isSelected
                ? (form.sizes || []).filter(s => s !== m)
                : [...(form.sizes || []), m];
              set("sizes", newSizes);
              if (isSelected) {
                const sp = { ...(form.size_prices || {}) };
                delete sp[m];
                set("size_prices", sp);
              }
            };

            const addCustomMetre = () => {
              const val = customMetreInput.trim();
              if (!val) return;
              const alreadyHasMetre = /metre|meter/i.test(val);
              const normalized = alreadyHasMetre
                ? val
                : `${val.replace(/\s*m$/i, "").trim()} Metre`;
              if (!(form.sizes || []).includes(normalized)) {
                set("sizes", [...(form.sizes || []), normalized]);
              }
              setCustomMetreInput("");
            };

            return (
              <div className="space-y-3">
                <label style={labelStyle}>Metre Sizes & Prices</label>
                <p className="text-xs" style={{ color: creamDim }}>
                  Click a size to select it, then set its price below.
                </p>

                {/* Grid of metre option buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {allMetreOptions.map(m => {
                    const isSelected = (form.sizes || []).includes(m);
                    const isCustom = !METRE_OPTIONS.includes(m);
                    return (
                      <div key={m} className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => toggleMetre(m)}
                          className="w-full py-2 text-xs tracking-wider uppercase transition-all relative"
                          style={{
                            border: `1px solid ${isSelected ? gold : border}`,
                            color: isSelected ? gold : creamDim,
                            background: isSelected ? `${gold}18` : "transparent",
                          }}>
                          {m}
                          {isCustom && (
                            <span
                              onClick={e => {
                                e.stopPropagation();
                                const newSizes = (form.sizes || []).filter(s => s !== m);
                                const sp = { ...(form.size_prices || {}) };
                                delete sp[m];
                                set("sizes", newSizes);
                                set("size_prices", sp);
                              }}
                              className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center"
                              style={{ background: "#f87171", borderRadius: "50%", color: "#fff" }}>
                              <X size={8} />
                            </span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Custom metre input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customMetreInput}
                    onChange={e => setCustomMetreInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCustomMetre())}
                    placeholder="Custom metres (e.g. 2)"
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={focusGold} onBlur={blurBorder}
                  />
                  <button
                    type="button"
                    onClick={addCustomMetre}
                    className="px-4 py-2 text-xs transition-colors"
                    style={{ background: `${gold}20`, color: gold, border: `1px solid ${gold}40` }}>
                    Add
                  </button>
                </div>

                {/* Price inputs for selected sizes */}
                {(form.sizes || []).length > 0 && (
                  <div className="space-y-2" style={{ borderTop: `1px solid ${border}`, paddingTop: 12 }}>
                    <p className="text-xs" style={{ color: creamDim }}>Set price for each selected size:</p>
                    {(form.sizes || []).map(m => (
                      <div key={m} className="flex items-center gap-3">
                        <span className="text-xs font-medium w-16 uppercase tracking-wider flex-shrink-0" style={{ color: gold }}>{m}</span>
                        <span className="text-xs" style={{ color: creamDim }}>₹</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="Price"
                          value={form.size_prices?.[m] ?? ""}
                          onChange={e => {
                            if (/^\d*$/.test(e.target.value)) {
                              const sp = { ...(form.size_prices || {}) };
                              if (e.target.value === "") delete sp[m];
                              else sp[m] = parseFloat(e.target.value);
                              set("size_prices", sp);
                            }
                          }}
                          style={{ ...inputStyle, width: 120 }}
                          onFocus={focusGold} onBlur={blurBorder}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Bangle Sizes + per-size prices (bangles only) */}
          {(() => {
            const selectedCatForBangle = categories.find(c => String(c.id) === String(form.category_id));
            if (!selectedCatForBangle?.name?.toLowerCase().includes("bangle")) return null;
            if (form.pricing_unit !== "bangle") return null;

            const allBangleOptions = [
              ...BANGLE_OPTIONS,
              ...((form.sizes || []).filter(s => !BANGLE_OPTIONS.includes(s))),
            ];

            const toggleBangle = (size) => {
              const isSelected = (form.sizes || []).includes(size);
              const newSizes = isSelected
                ? (form.sizes || []).filter(s => s !== size)
                : [...(form.sizes || []), size];
              set("sizes", newSizes);
              if (isSelected) {
                const sp = { ...(form.size_prices || {}) };
                delete sp[size];
                set("size_prices", sp);
              }
            };

            return (
              <div className="space-y-3">
                <label style={labelStyle}>Bangle Sizes & Prices</label>
                <p className="text-xs" style={{ color: creamDim }}>
                  Click a size to select it, then enter its price below.
                </p>

                <div className="grid grid-cols-4 gap-2">
                  {allBangleOptions.map(size => {
                    const isSelected = (form.sizes || []).includes(size);
                    const isCustom = !BANGLE_OPTIONS.includes(size);
                    return (
                      <div key={size} className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => toggleBangle(size)}
                          className="w-full py-2 text-xs tracking-wider uppercase transition-all relative"
                          style={{
                            border: `1px solid ${isSelected ? gold : border}`,
                            color: isSelected ? gold : creamDim,
                            background: isSelected ? `${gold}18` : "transparent",
                          }}>
                          {size}
                          {isCustom && (
                            <span
                              onClick={e => {
                                e.stopPropagation();
                                const newSizes = (form.sizes || []).filter(s => s !== size);
                                const sp = { ...(form.size_prices || {}) };
                                delete sp[size];
                                set("sizes", newSizes);
                                set("size_prices", sp);
                              }}
                              className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center"
                              style={{ background: "#f87171", borderRadius: "50%", color: "#fff" }}>
                              <X size={8} />
                            </span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Custom size input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customMlInput}
                    onChange={e => setCustomMlInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const val = customMlInput.trim();
                        if (val && !(form.sizes || []).includes(val)) {
                          set("sizes", [...(form.sizes || []), val]);
                        }
                        setCustomMlInput("");
                      }
                    }}
                    placeholder="Custom size (e.g. 2-10)"
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={focusGold} onBlur={blurBorder}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = customMlInput.trim();
                      if (val && !(form.sizes || []).includes(val)) {
                        set("sizes", [...(form.sizes || []), val]);
                      }
                      setCustomMlInput("");
                    }}
                    className="px-4 py-2 text-xs transition-colors"
                    style={{ background: `${gold}20`, color: gold, border: `1px solid ${gold}40` }}>
                    Add
                  </button>
                </div>

                {/* Price inputs for selected sizes */}
                {(form.sizes || []).length > 0 && (
                  <div className="space-y-2" style={{ borderTop: `1px solid ${border}`, paddingTop: 12 }}>
                    <p className="text-xs" style={{ color: creamDim }}>Set price for each selected size:</p>
                    {(form.sizes || []).map(size => (
                      <div key={size} className="flex items-center gap-3">
                        <span className="text-xs font-medium w-16 uppercase tracking-wider flex-shrink-0" style={{ color: gold }}>{size}</span>
                        <span className="text-xs" style={{ color: creamDim }}>₹</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="Price"
                          value={form.size_prices?.[size] ?? ""}
                          onChange={e => {
                            if (/^\d*$/.test(e.target.value)) {
                              const sp = { ...(form.size_prices || {}) };
                              if (e.target.value === "") delete sp[size];
                              else sp[size] = parseFloat(e.target.value);
                              set("size_prices", sp);
                            }
                          }}
                          style={{ ...inputStyle, width: 120 }}
                          onFocus={focusGold} onBlur={blurBorder}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Price + Compare */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>
                Price (₹) *{["ml","metre","bangle"].includes(form.pricing_unit) ? " — base / fallback price" : form.pricing_unit !== "piece" ? ` — per ${form.pricing_unit}` : ""}
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
            const isKundan = selectedCat && selectedCat.name.toLowerCase().includes("kundan");
            const isGramBased = form.pricing_unit === "gram" || form.pricing_unit === "kg" || isKundan;
            const gramOptions = [
              { label: "5g",   value: 5 },
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
                <label style={labelStyle}>
                  Stock Quantity{isGramBased ? " (in grams)" : ""}
                </label>
                {isGramBased ? (
                  <select value={form.stock_quantity || ""} onChange={e => set("stock_quantity", parseInt(e.target.value))}
                    style={{ ...inputStyle, cursor: "pointer" }} onFocus={focusGold} onBlur={blurBorder}>
                    <option value="">Select quantity</option>
                    {gramOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : (
                  <input type="number" min={0} value={form.stock_quantity} onChange={e => set("stock_quantity", Math.max(0, parseInt(e.target.value) || 0))}
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
                    Display Name for {activeColor} — leave blank to use product name
                  </label>
                  <input
                    type="text"
                    placeholder={`e.g. Moon White Kundans`}
                    value={form.color_names?.[activeColor] ?? ""}
                    onChange={e => {
                      const cn = { ...(form.color_names || {}) };
                      if (e.target.value === "") delete cn[activeColor];
                      else cn[activeColor] = e.target.value;
                      set("color_names", cn);
                    }}
                    style={inputStyle}
                    onFocus={focusGold} onBlur={blurBorder}
                  />
                </div>
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
                <p className="text-xs mb-2" style={{ color: creamDim }}>Product images — enter a type label for each (e.g. Round, Square)</p>
                <div className="flex gap-3 flex-wrap">
                  {(form.images || []).map((url, i) => (
                    <div key={i} className="flex flex-col gap-1" style={{ width: 80 }}>
                      <div className="relative">
                        <img src={url} alt="" className="w-20 h-20 object-cover" style={{ border: `1px solid ${border}` }} />
                        <button onClick={() => {
                          set("images", form.images.filter(x => x !== url));
                          const it = { ...(form.image_types || {}) };
                          delete it[url];
                          set("image_types", it);
                        }}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center"
                          style={{ background: "#f87171", color: "#fff", borderRadius: "50%" }}>
                          <X size={9} />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Type"
                        value={form.image_types?.[url] ?? ""}
                        onChange={e => set("image_types", { ...(form.image_types || {}), [url]: e.target.value })}
                        style={{ ...inputStyle, padding: "4px 6px", fontSize: 11, textAlign: "center" }}
                        onFocus={focusGold} onBlur={blurBorder}
                      />
                    </div>
                  ))}
                  <label className="w-20 h-20 flex flex-col items-center justify-center cursor-pointer gap-1"
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
