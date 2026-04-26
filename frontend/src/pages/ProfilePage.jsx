import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Lock, MapPin, LogOut, Save, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
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
              {tab === "addresses" && (
                <>
                  <p className="section-tag mb-2">Shipping</p>
                  <h2 className="text-2xl font-normal mb-8 pb-6"
                    style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)", borderBottom: "1px solid var(--border)" }}>
                    Saved Addresses
                  </h2>
                  <div className="py-8 text-center">
                    <MapPin size={32} className="mx-auto mb-4" style={{ color: "var(--border)" }} />
                    <p style={{ color: "var(--cream-dim)" }}>
                      Your saved addresses will appear here after checkout.
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
