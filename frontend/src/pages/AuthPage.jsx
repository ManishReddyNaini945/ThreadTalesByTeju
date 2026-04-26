import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "At least 6 characters"),
});

const signupSchema = z.object({
  full_name: z.string().min(2, "At least 2 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  password: z.string().min(6, "At least 6 characters"),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

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

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "var(--cream-dim)" }}>
        {label}
      </label>
      {children}
      {error && <p className="text-xs mt-1.5" style={{ color: "#e87070" }}>{error}</p>}
    </div>
  );
}

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, signup, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const loginForm = useForm({ resolver: zodResolver(loginSchema) });
  const signupForm = useForm({ resolver: zodResolver(signupSchema) });

  const handleLogin = async (data) => {
    setIsSubmitting(true);
    try {
      await login(data);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (data) => {
    setIsSubmitting(true);
    try {
      const { confirm_password, ...rest } = data;
      await signup(rest);
      toast.success("Account created! Welcome to Thread Tales.");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      toast.success("Signed in with Google!");
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.detail || "Google sign-in failed";
      toast.error(msg);
    }
  };

  const focusStyle = (e) => { e.target.style.borderColor = "var(--gold)"; };
  const blurStyle = (e) => { e.target.style.borderColor = "var(--border)"; };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg)" }}>

        {/* Left Panel — fixed, never moves */}
        <div className="hidden lg:flex w-1/2 h-screen flex-col items-center justify-center p-12 relative overflow-hidden flex-shrink-0"
          style={{ background: "var(--bg-card)", borderRight: "1px solid var(--border)" }}>
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #c8a45c 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          <div className="absolute top-16 right-16 w-48 h-48 rounded-full border opacity-10" style={{ borderColor: "var(--gold)" }} />
          <div className="absolute bottom-16 left-16 w-28 h-28 rounded-full border opacity-10" style={{ borderColor: "var(--gold)" }} />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="text-center relative z-10">
            <div className="text-5xl mb-8" style={{ color: "var(--gold)" }}>✦</div>
            <h1 className="text-4xl font-normal mb-3"
              style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
              Thread Tales
            </h1>
            <p className="text-lg mb-6" style={{ color: "var(--gold)" }}>by Teju</p>
            <div className="w-12 h-px mx-auto mb-6" style={{ background: "var(--gold)" }} />
            <p className="max-w-xs leading-relaxed text-sm" style={{ color: "var(--cream-dim)" }}>
              Handcrafted with love. Each piece tells a story of tradition, artistry, and timeless beauty.
            </p>
          </motion.div>
        </div>

        {/* Right Panel — scrollable */}
        <div className="w-full lg:w-1/2 h-screen overflow-y-auto flex flex-col items-center justify-center p-8"
          style={{ background: "var(--bg)" }}>
          <div className="w-full max-w-md">

            <Link to="/" className="flex items-center gap-2 mb-10 text-sm transition-colors duration-200 group"
              style={{ color: "var(--cream-dim)" }}>
              <ArrowLeft size={15} style={{ color: "var(--gold)" }} />
              Back to home
            </Link>

            <p className="section-tag mb-3">Welcome</p>
            <h2 className="text-3xl font-normal mb-8"
              style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
              {mode === "login" ? "Sign In" : "Create Account"}
            </h2>

            {/* Tab toggle */}
            <div className="flex p-1 mb-8" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              {["login", "signup"].map((m) => (
                <button key={m} onClick={() => setMode(m)}
                  className="flex-1 py-2.5 text-sm font-medium tracking-wide transition-all duration-200"
                  style={{
                    background: mode === m ? "var(--gold)" : "transparent",
                    color: mode === m ? "var(--bg)" : "var(--cream-dim)",
                  }}>
                  {m === "login" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {mode === "login" ? (
                <motion.form key="login"
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={loginForm.handleSubmit(handleLogin)}
                  className="flex flex-col gap-5">

                  <Field label="Email" error={loginForm.formState.errors.email?.message}>
                    <input {...loginForm.register("email")} type="email" placeholder="you@example.com"
                      style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                  </Field>

                  <Field label="Password" error={loginForm.formState.errors.password?.message}>
                    <div className="relative">
                      <input {...loginForm.register("password")} type={showPassword ? "text" : "password"}
                        placeholder="••••••••" style={{ ...inputStyle, paddingRight: 44 }}
                        onFocus={focusStyle} onBlur={blurStyle} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: "var(--cream-dim)" }}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </Field>

                  <button type="submit" disabled={isSubmitting} className="btn-gold w-full justify-center mt-2">
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </button>

                  <div className="flex items-center gap-3 my-1">
                    <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                    <span className="text-xs" style={{ color: "var(--cream-dim)" }}>or continue with</span>
                    <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                  </div>

                  <div className="flex justify-center">
                    <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error("Google sign-in failed")}
                      theme="filled_black" size="large" width="100%" shape="rectangular" />
                  </div>
                </motion.form>
              ) : (
                <motion.form key="signup"
                  initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={signupForm.handleSubmit(handleSignup)}
                  className="flex flex-col gap-5">

                  <Field label="Full Name" error={signupForm.formState.errors.full_name?.message}>
                    <input {...signupForm.register("full_name")} placeholder="Your full name"
                      style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                  </Field>

                  <Field label="Email" error={signupForm.formState.errors.email?.message}>
                    <input {...signupForm.register("email")} type="email" placeholder="you@example.com"
                      style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                  </Field>

                  <Field label="Phone (optional)">
                    <input {...signupForm.register("phone")} type="tel" placeholder="+91 98765 43210"
                      style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                  </Field>

                  <Field label="Password" error={signupForm.formState.errors.password?.message}>
                    <div className="relative">
                      <input {...signupForm.register("password")} type={showPassword ? "text" : "password"}
                        placeholder="Min. 6 characters" style={{ ...inputStyle, paddingRight: 44 }}
                        onFocus={focusStyle} onBlur={blurStyle} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: "var(--cream-dim)" }}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </Field>

                  <Field label="Confirm Password" error={signupForm.formState.errors.confirm_password?.message}>
                    <input {...signupForm.register("confirm_password")} type="password" placeholder="Repeat password"
                      style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                  </Field>

                  <button type="submit" disabled={isSubmitting} className="btn-gold w-full justify-center mt-2">
                    {isSubmitting ? "Creating account..." : "Create Account"}
                  </button>

                  <div className="flex items-center gap-3 my-1">
                    <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                    <span className="text-xs" style={{ color: "var(--cream-dim)" }}>or continue with</span>
                    <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                  </div>

                  <div className="flex justify-center">
                    <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error("Google sign-in failed")}
                      theme="filled_black" size="large" width="100%" shape="rectangular" />
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
