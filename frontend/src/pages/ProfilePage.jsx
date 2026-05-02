import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Lock, MapPin, LogOut, Save, ChevronRight, Package, Plus, Trash2, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import { addressService } from "../services/addressService";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  background: "var(--bg)",
  border: "1px solid var(--border)",
  color: "var(--cream)",
  fontSize: "14px",
  outline: "none",
  caretColor: "var(--gold)",
  transition: "border-color 0.2s ease",
};

const disabledInputStyle = {
  ...inputStyle,
  background: "var(--bg-card)",
  color: "var(--cream-dim)",
  cursor: "not-allowed",
  opacity: 0.6,
};

const focusStyle = (e) => { e.target.style.borderColor = "var(--gold)"; };
const blurStyle = (e) => { e.target.style.borderColor = "var(--border)"; };

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "password", label: "Password", icon: Lock },
  { id: "addresses", label: "Addresses", icon: MapPin },
];

const emptyAddr = { full_name: "", phone: "", address_line1: "", address_line2: "", city: "", state: "", pincode: "", country: "India", is_default: false };

function AddressesTab({ inputStyle, focusStyle, blurStyle }) {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyAddr);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    addressService.getAddresses().then(({ data }) => setAddresses(data)).catch(() => {});
  }, []);

  const openAdd = () => { setEditing(null); setForm(emptyAddr); setShowForm(true); };
  const openEdit = (addr) => { setEditing(addr.id); setForm({ ...addr }); setShowForm(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const { data } = await addressService.updateAddress(editing, form);
        setAddresses((prev) => prev.map((a) => a.id === editing ? data : (form.is_default ? { ...a, is_default: false } : a)));
      } else {
        const { data } = await addressService.createAddress(form);
        setAddresses((prev) => form.is_default ? [data, ...prev.map((a) => ({ ...a, is_default: false }))] : [data, ...prev]);
      }
      toast.success(editing ? "Address updated!" : "Address added!");
      setShowForm(false);
    } catch { toast.error("Failed to save address"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await addressService.deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Address removed");
    } catch { toast.error("Failed to delete"); }
  };

  const handleSetDefault = async (id) => {
    try {
      const { data } = await addressService.setDefault(id);
      setAddresses((prev) => prev.map((a) => ({ ...a, is_default: a.id === id })));
      toast.success("Default address updated");
    } catch { toast.error("Failed to update"); }
  };

  const fields = [
    { key: "full_name", label: "Full Name", placeholder: "Your full name", span: 1 },
    { key: "phone", label: "Phone", placeholder: "+91 98765 43210", span: 1 },
    { key: "address_line1", label: "Address Line 1", placeholder: "House / Street", span: 2 },
    { key: "address_line2", label: "Address Line 2 (optional)", placeholder: "Landmark, Colony", span: 2 },
    { key: "city", label: "City", placeholder: "City", span: 1 },
    { key: "state", label: "State", placeholder: "State", span: 1 },
    { key: "pincode", label: "Pincode", placeholder: "560001", span: 1 },
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-8 pb-6" style={{ borderBottom: "1px solid var(--border)" }}>
        <div>
          <p className="section-tag mb-1">Shipping</p>
          <h2 className="text-2xl font-normal" style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
            Saved Addresses
          </h2>
        </div>
        {!showForm && (
          <button onClick={openAdd} className="btn-gold flex items-center gap-2 px-4 py-2 text-xs">
            <Plus size={14} /> Add New
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="mb-8 p-5 space-y-4" style={{ border: "1px solid var(--border)", background: "var(--bg)" }}>
          <p className="text-sm font-medium" style={{ color: "var(--gold)" }}>{editing ? "Edit Address" : "New Address"}</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {fields.map(({ key, label, placeholder, span }) => (
              <div key={key} className={span === 2 ? "sm:col-span-2" : ""}>
                <label className="block text-xs tracking-[0.2em] uppercase mb-1.5" style={{ color: "var(--cream-dim)" }}>{label}</label>
                <input value={form[key] || ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            ))}
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_default} onChange={(e) => setForm({ ...form, is_default: e.target.checked })} className="accent-[#c8a45c]" />
            <span className="text-sm" style={{ color: "var(--cream-dim)" }}>Set as default address</span>
          </label>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-gold flex items-center gap-2 px-5 py-2.5 text-xs">
              <Save size={13} /> {saving ? "Saving..." : "Save Address"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline px-5 py-2.5 text-xs">Cancel</button>
          </div>
        </form>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="py-10 text-center">
          <MapPin size={32} className="mx-auto mb-3" style={{ color: "var(--border)" }} />
          <p style={{ color: "var(--cream-dim)" }}>No saved addresses yet. Add one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div key={addr.id} className="p-4 flex items-start justify-between gap-4"
              style={{ border: `1px solid ${addr.is_default ? "var(--gold)" : "var(--border)"}`, background: addr.is_default ? "rgba(200,164,92,0.05)" : "transparent" }}>
              <div className="flex-1 text-sm space-y-0.5">
                <div className="flex items-center gap-2">
                  <p className="font-medium" style={{ color: "var(--cream)" }}>{addr.full_name}</p>
                  {addr.is_default && (
                    <span className="text-[10px] tracking-widest uppercase px-2 py-0.5" style={{ background: "rgba(200,164,92,0.15)", color: "var(--gold)", border: "1px solid var(--gold)" }}>
                      Default
                    </span>
                  )}
                </div>
                <p style={{ color: "var(--cream-dim)" }}>{addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ""}</p>
                <p style={{ color: "var(--cream-dim)" }}>{addr.city}, {addr.state} – {addr.pincode}</p>
                <p style={{ color: "var(--cream-dim)" }}>{addr.phone}</p>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                {!addr.is_default && (
                  <button onClick={() => handleSetDefault(addr.id)} className="text-xs flex items-center gap-1 transition-colors"
                    style={{ color: "var(--gold)" }}>
                    <Star size={11} /> Set default
                  </button>
                )}
                <button onClick={() => openEdit(addr)} className="text-xs transition-colors" style={{ color: "var(--cream-dim)" }}>Edit</button>
                <button onClick={() => handleDelete(addr.id)} className="text-xs transition-colors" style={{ color: "#f87171" }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const [tab, setTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ full_name: user?.full_name || "", phone: user?.phone || "" });
  const [passwords, setPasswords] = useState({ current_password: "", new_password: "", confirm: "" });

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  const initials = user?.full_name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await authService.updateProfile(formData);
      updateUser(data);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm) { toast.error("Passwords don't match"); return; }
    setSaving(true);
    try {
      await authService.changePassword({ current_password: passwords.current_password, new_password: passwords.new_password });
      toast.success("Password changed!");
      setPasswords({ current_password: "", new_password: "", confirm: "" });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 lg:px-10 pt-32 pb-20">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-xs tracking-widest uppercase">
          <Link to="/" className="transition-colors duration-200 hover:text-gold" style={{ color: "var(--cream-dim)" }}>Home</Link>
          <ChevronRight size={12} style={{ color: "var(--border)" }} />
          <span style={{ color: "var(--gold)" }}>My Account</span>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">

          {/* Sidebar */}
          <div className="lg:col-span-1">

            {/* User card */}
            <div className="p-6 mb-4 flex flex-col items-center text-center"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="" className="w-16 h-16 object-cover mb-3"
                  style={{ border: "2px solid var(--gold)" }} />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center text-xl font-medium mb-3"
                  style={{ background: "rgba(200,164,92,0.15)", border: "2px solid var(--gold)", color: "var(--gold)" }}>
                  {initials}
                </div>
              )}
              <p className="font-normal text-base mb-1"
                style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
                {user?.full_name}
              </p>
              <p className="text-xs truncate w-full" style={{ color: "var(--cream-dim)" }}>
                {user?.email}
              </p>
              {user?.role === "admin" && (
                <span className="mt-2 text-[10px] tracking-widest uppercase px-3 py-1"
                  style={{ background: "rgba(200,164,92,0.15)", color: "var(--gold)", border: "1px solid var(--gold)" }}>
                  Admin
                </span>
              )}
            </div>

            {/* Tab nav */}
            <div className="flex flex-col" style={{ border: "1px solid var(--border)" }}>
              {TABS.map(({ id, label, icon: Icon }, i) => (
                <button key={id} onClick={() => setTab(id)}
                  className="flex items-center gap-3 px-5 py-4 text-sm text-left transition-all duration-200"
                  style={{
                    background: tab === id ? "rgba(200,164,92,0.1)" : "var(--bg-card)",
                    color: tab === id ? "var(--gold)" : "var(--cream-dim)",
                    borderBottom: i < TABS.length - 1 ? "1px solid var(--border)" : "none",
                    borderLeft: tab === id ? "2px solid var(--gold)" : "2px solid transparent",
                  }}>
                  <Icon size={15} />
                  {label}
                </button>
              ))}

              <Link to="/orders"
                className="flex items-center gap-3 px-5 py-4 text-sm transition-all duration-200"
                style={{ color: "var(--cream-dim)", borderTop: "1px solid var(--border)", background: "var(--bg-card)", borderLeft: "2px solid transparent" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.borderLeftColor = "var(--gold)"; e.currentTarget.style.background = "rgba(200,164,92,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--cream-dim)"; e.currentTarget.style.borderLeftColor = "transparent"; e.currentTarget.style.background = "var(--bg-card)"; }}>
                <Package size={15} />
                My Orders
              </Link>

              <button onClick={logout}
                className="flex items-center gap-3 px-5 py-4 text-sm transition-all duration-200"
                style={{ color: "#e87070", borderTop: "1px solid var(--border)", background: "var(--bg-card)" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(232,112,112,0.08)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "var(--bg-card)"}>
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-8" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>

              {/* Profile Tab */}
              {tab === "profile" && (
                <>
                  <p className="section-tag mb-2">Account</p>
                  <h2 className="text-2xl font-normal mb-8 pb-6"
                    style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)", borderBottom: "1px solid var(--border)" }}>
                    Personal Information
                  </h2>
                  <form onSubmit={saveProfile} className="flex flex-col gap-6">
                    <div>
                      <label className="block text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "var(--cream-dim)" }}>
                        Full Name
                      </label>
                      <input value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                    </div>

                    <div>
                      <label className="block text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "var(--cream-dim)" }}>
                        Email <span className="normal-case tracking-normal ml-1" style={{ color: "var(--border)" }}>(cannot change)</span>
                      </label>
                      <input value={user?.email} disabled style={disabledInputStyle} />
                    </div>

                    <div>
                      <label className="block text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "var(--cream-dim)" }}>
                        Phone Number
                      </label>
                      <input value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98660 52260"
                        style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                    </div>

                    <div>
                      <button type="submit" disabled={saving} className="btn-gold flex items-center gap-2">
                        <Save size={14} /> {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </>
              )}

              {/* Password Tab */}
              {tab === "password" && (
                <>
                  <p className="section-tag mb-2">Security</p>
                  <h2 className="text-2xl font-normal mb-8 pb-6"
                    style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)", borderBottom: "1px solid var(--border)" }}>
                    Change Password
                  </h2>
                  {user?.auth_provider === "google" ? (
                    <div className="py-8 text-center">
                      <Lock size={32} className="mx-auto mb-4" style={{ color: "var(--border)" }} />
                      <p style={{ color: "var(--cream-dim)" }}>
                        Your account uses Google sign-in. Password change is not available.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={changePassword} className="flex flex-col gap-6">
                      {[
                        { key: "current_password", label: "Current Password", placeholder: "Enter current password" },
                        { key: "new_password", label: "New Password", placeholder: "Enter new password" },
                        { key: "confirm", label: "Confirm New Password", placeholder: "Repeat new password" },
                      ].map(({ key, label, placeholder }) => (
                        <div key={key}>
                          <label className="block text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "var(--cream-dim)" }}>
                            {label}
                          </label>
                          <input type="password" value={passwords[key]} placeholder={placeholder}
                            onChange={(e) => setPasswords({ ...passwords, [key]: e.target.value })}
                            style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                        </div>
                      ))}
                      <div>
                        <button type="submit" disabled={saving} className="btn-gold flex items-center gap-2">
                          <Lock size={14} /> {saving ? "Updating..." : "Update Password"}
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}

              {/* Addresses Tab */}
              {tab === "addresses" && <AddressesTab inputStyle={inputStyle} focusStyle={focusStyle} blurStyle={blurStyle} />}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
