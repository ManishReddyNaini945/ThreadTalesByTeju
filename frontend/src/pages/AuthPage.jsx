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
import api from "../services/api";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "At least 6 characters"),
});

const signupSchema = z.object({
  full_name: z.string().min(2, "At least 2 characters"),
  email: z.string().email("Invalid email"),
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
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const { login, signup, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const loginForm = useForm({ resolver: zodResolver(loginSchema) });
  const signupForm = useForm({ resolver: zodResolver(signupSchema) });

  const redirectAfterAuth = (user) => {
    navigate(user?.role === "admin" ? "/admin" : from, { replace: true });
  };

  const handleLogin = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await login(data);
      toast.success("Welcome back!");
      redirectAfterAuth(result.user);
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
      const result = await signup(rest);
      toast.success("Account created! Welcome to Thread Tales.");
      redirectAfterAuth(result.user);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const result = await googleLogin(credentialResponse.credential);
      toast.success("Signed in with Google!");
      redirectAfterAuth(result.user);
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Google sign-in failed");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setIsSubmitting(true);
    try {
      await api.post("/auth/forgot-password", { email: forgotEmail });
      setForgotSent(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const focusStyle = (e) => { e.target.style.borderColor = "var(--gold)"; };
  const blurStyle = (e) => { e.target.style.borderColor = "var(--border)"; };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg)" }}>

        {/* Left Panel */}
        <div className="hidden lg:flex w-1/2 h-screen flex-col items-center justify-center p-12 relative overflow-hidden flex-shrink-0"
          style={{ background: "var(--bg-card)", borderRight: "1px solid var(--border)" }}>
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #c8a45c 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          <div className="absolute top-16 right-16 w-48 h-48 rounded-full border opacity-10" style={{ borderColor: "var(--gold)" }} />
          <div className="absolute bottom-16 left-16 w-28 h-28 rounded-full border opacity-10" style={{ borderColor: "var(--gold)" }} />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="text-center relative z-10">
            <div className="mx-auto mb-8 w-40 h-40 rounded-full bg-white overflow-hidden shadow-lg" style={{ boxShadow: "0 0 24px rgba(200,164,92,0.25)" }}>
              <img src="/web-app-manifest-512x512.png" alt="Thread Tales by Teju" className="w-full h-full object-contain" />
            </div>
            <div className="w-12 h-px mx-auto mb-6" style={{ background: "var(--gold)" }} />
            <p className="max-w-xs leading-relaxed text-sm" style={{ color: "var(--cream-dim)" }}>
              Handcrafted with love. Each piece tells a story of tradition, artistry, and timeless beauty.
            </p>
          </motion.div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-1/2 h-screen overflow-y-auto flex flex-col items-center justify-center p-8"
          style={{ background: "var(--bg)" }}>
          <div className="w-full max-w-md">

            <Link to="/" className="flex items-center gap-2 mb-10 text-sm transition-colors duration-200"
              style={{ color: "var(--cream-dim)" }}>
              <ArrowLeft size={15} style={{ color: "var(--gold)" }} />
              Back to home
            </Link>

            <p className="section-tag mb-3">{mode === "forgot" ? "Account Recovery" : "Welcome"}</p>
            <h2 className="text-3xl font-normal mb-8"
              style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
              {mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Forgot Password"}
            </h2>

            {/* Google */}
            {mode !== "forgot" && (
              <>
                <div className="flex justify-center mb-6">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error("Google sign-in failed")}
                    theme="filled_black"
                    size="large"
                    width="400"
                    shape="rectangular"
                  />
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                  <span className="text-xs" style={{ color: "var(--cream-dim)" }}>or continue with email</span>
                  <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                </div>
              </>
            )}

            <AnimatePresence mode="wait">
              {mode === "forgot" ? (
                <motion.div key="forgot"
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.25 }}>
                  {forgotSent ? (
                    <div className="text-center py-4">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                        style={{ background: "rgba(200,164,92,0.1)", border: "1px solid var(--gold)" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c8a45c" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                      </div>
                      <h3 className="text-lg mb-2" style={{ color: "var(--cream)", fontFamily: "Playfair Display, serif" }}>Check your inbox</h3>
                      <p className="text-sm mb-6" style={{ color: "var(--cream-dim)" }}>
                        If an account exists for <strong style={{ color: "var(--cream)" }}>{forgotEmail}</strong>, a reset link has been sent.
                      </p>
                      <button type="button" onClick={() => setMode("login")}
                        className="text-sm hover:underline" style={{ color: "var(--gold)" }}>
                        Back to Sign In
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleForgotPassword} className="flex flex-col gap-5">
                      <p className="text-sm" style={{ color: "var(--cream-dim)" }}>
                        Enter your email and we'll send you a link to reset your password.
                      </p>
                      <Field label="Email">
                        <input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="you@example.com" required style={inputStyle}
                          onFocus={focusStyle} onBlur={blurStyle} />
                      </Field>
                      <button type="submit" disabled={isSubmitting} className="btn-gold w-full justify-center mt-2">
                        {isSubmitting ? "Sending..." : "Send Reset Link"}
                      </button>
                      <p className="text-center text-sm">
                        <button type="button" onClick={() => setMode("login")}
                          className="hover:underline" style={{ color: "var(--gold)" }}>
                          Back to Sign In
                        </button>
                      </p>
                    </form>
                  )}
                </motion.div>
              ) : mode === "login" ? (
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

                  <div className="text-right">
                    <button type="button" onClick={() => { setMode("forgot"); setForgotSent(false); setForgotEmail(""); }}
                      className="text-xs hover:underline" style={{ color: "var(--gold)" }}>
                      Forgot password?
                    </button>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="btn-gold w-full justify-center mt-2">
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </button>

                  <p className="text-center text-sm" style={{ color: "var(--cream-dim)" }}>
                    New to Thread Tales?{" "}
                    <button type="button" onClick={() => setMode("signup")}
                      className="hover:underline font-medium" style={{ color: "var(--gold)" }}>
                      Create account
                    </button>
                  </p>
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

                  <p className="text-center text-sm" style={{ color: "var(--cream-dim)" }}>
                    Already have an account?{" "}
                    <button type="button" onClick={() => setMode("login")}
                      className="hover:underline font-medium" style={{ color: "var(--gold)" }}>
                      Sign In
                    </button>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
