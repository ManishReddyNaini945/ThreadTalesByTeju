import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import api from "../services/api";

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

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const focusStyle = (e) => { e.target.style.borderColor = "var(--gold)"; };
  const blurStyle = (e) => { e.target.style.borderColor = "var(--border)"; };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (password !== confirm) { toast.error("Passwords don't match"); return; }
    setIsSubmitting(true);
    try {
      await api.post("/auth/reset-password", { token, new_password: password });
      setDone(true);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid or expired link. Please request a new one.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="text-center">
          <p className="mb-4" style={{ color: "var(--cream-dim)" }}>Invalid reset link.</p>
          <Link to="/auth" className="text-sm hover:underline" style={{ color: "var(--gold)" }}>Back to Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--bg)" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md">

        <Link to="/auth" className="flex items-center gap-2 mb-10 text-sm" style={{ color: "var(--cream-dim)" }}>
          <ArrowLeft size={15} style={{ color: "var(--gold)" }} />
          Back to Sign In
        </Link>

        <p className="section-tag mb-3">Security</p>
        <h2 className="text-3xl font-normal mb-8" style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
          Reset Password
        </h2>

        {done ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: "rgba(74,222,128,0.1)", border: "1px solid #4ade80" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-lg mb-2" style={{ color: "var(--cream)", fontFamily: "Playfair Display, serif" }}>Password Updated</h3>
            <p className="text-sm mb-6" style={{ color: "var(--cream-dim)" }}>Your password has been reset successfully.</p>
            <button onClick={() => navigate("/auth")} className="btn-gold">
              Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "var(--cream-dim)" }}>
                New Password
              </label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters" required
                  style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={focusStyle} onBlur={blurStyle} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--cream-dim)" }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "var(--cream-dim)" }}>
                Confirm Password
              </label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat password" required style={inputStyle}
                onFocus={focusStyle} onBlur={blurStyle} />
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-gold w-full justify-center mt-2">
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
