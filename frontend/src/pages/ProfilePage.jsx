import { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, MapPin, LogOut, Camera, Save } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const [tab, setTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ full_name: user?.full_name || "", phone: user?.phone || "" });
  const [passwords, setPasswords] = useState({ current_password: "", new_password: "", confirm: "" });
  const [addresses, setAddresses] = useState([]);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "password", label: "Password", icon: Lock },
    { id: "addresses", label: "Addresses", icon: MapPin },
  ];

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

  const initials = user?.full_name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-6 flex items-center gap-5">
          <div className="relative">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="" className="w-16 h-16 rounded-2xl object-cover" />
            ) : (
              <div className="w-16 h-16 bg-brand-gold/20 rounded-2xl flex items-center justify-center text-brand-gold font-bold text-xl">
                {initials}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-brand-dark">{user?.full_name}</h1>
            <p className="text-brand-dark/50 text-sm">{user?.email}</p>
            {user?.role === "admin" && (
              <span className="text-xs bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded-full mt-1 inline-block">Admin</span>
            )}
          </div>
          <button onClick={logout}
            className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-500 rounded-xl text-sm hover:bg-red-50 transition-colors">
            <LogOut size={15} /> Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1.5 shadow-sm">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === id ? "bg-brand-dark text-brand-cream" : "text-brand-dark/60 hover:text-brand-dark"}`}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === "profile" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="font-semibold text-brand-dark mb-5">Personal Information</h2>
            <form onSubmit={saveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-brand-dark/70 mb-1.5">Full Name</label>
                <input value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-brand-dark/10 text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/40" />
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-dark/70 mb-1.5">Email (cannot change)</label>
                <input value={user?.email} disabled
                  className="w-full px-4 py-3 rounded-xl border border-brand-dark/10 text-brand-dark/40 bg-brand-dark/5 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-dark/70 mb-1.5">Phone</label>
                <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl border border-brand-dark/10 text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/40" />
              </div>
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-brand-dark text-brand-cream rounded-xl text-sm font-medium hover:bg-brand-gold transition-colors disabled:opacity-60">
                <Save size={15} /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </motion.div>
        )}

        {/* Password Tab */}
        {tab === "password" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="font-semibold text-brand-dark mb-5">Change Password</h2>
            {user?.auth_provider === "google" ? (
              <p className="text-brand-dark/50 text-sm">Your account uses Google sign-in. Password change is not applicable.</p>
            ) : (
              <form onSubmit={changePassword} className="space-y-4">
                {[
                  { key: "current_password", label: "Current Password", placeholder: "Current password" },
                  { key: "new_password", label: "New Password", placeholder: "New password" },
                  { key: "confirm", label: "Confirm New Password", placeholder: "Repeat new password" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-brand-dark/70 mb-1.5">{label}</label>
                    <input type="password" value={passwords[key]}
                      onChange={(e) => setPasswords({ ...passwords, [key]: e.target.value })}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-brand-dark/10 text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/40" />
                  </div>
                ))}
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-brand-dark text-brand-cream rounded-xl text-sm font-medium hover:bg-brand-gold transition-colors disabled:opacity-60">
                  <Lock size={15} /> {saving ? "Saving..." : "Update Password"}
                </button>
              </form>
            )}
          </motion.div>
        )}

        {/* Addresses Tab */}
        {tab === "addresses" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="font-semibold text-brand-dark mb-5">Saved Addresses</h2>
            <p className="text-brand-dark/50 text-sm">Manage your shipping addresses from the checkout page.</p>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}
