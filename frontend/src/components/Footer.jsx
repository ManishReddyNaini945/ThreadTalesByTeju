import { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Mail, Phone, MapPin, Heart } from "lucide-react";
import { toast } from "sonner";
import api from "../services/api";

const LINKS = {
  Shop: [
    { label: "Thread Bangles", to: "/shop?category=thread-bangles" },
    { label: "Bridal Sets", to: "/shop?category=bridal-bangle-sets" },
    { label: "Invisible Chains", to: "/shop?category=invisible-chains" },
    { label: "Hair Accessories", to: "/shop?category=hair-accessories" },
    { label: "Saree Pins", to: "/shop?category=saree-pins" },
  ],
  Account: [
    { label: "My Profile", to: "/profile" },
    { label: "My Orders", to: "/orders" },
    { label: "Wishlist", to: "/wishlist" },
    { label: "Cart", to: "/cart" },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { data } = await api.post("/newsletter/subscribe", { email });
      toast.success(data.message);
      setSubscribed(true);
    } catch { toast.error("Failed to subscribe. Try again."); }
    finally { setLoading(false); }
  };
  return (
    <footer style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <p className="text-2xl font-normal mb-1"
                style={{ fontFamily: "Playfair Display, serif", color: "var(--gold)" }}>
                Thread Tales
              </p>
              <p className="text-[9px] tracking-[0.4em] uppercase" style={{ color: "var(--cream-dim)" }}>
                by Teju
              </p>
            </div>
            <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--cream-dim)" }}>
              Handcrafted jewelry that tells your story. Made with love, worn with pride.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/thread_tales_by_teju"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 flex items-center justify-center transition-colors duration-200"
                style={{ border: "1px solid var(--border)", color: "var(--cream-dim)" }}
              >
                <Instagram size={15} />
              </a>
              <a
                href="https://wa.me/919866052260"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 flex items-center justify-center transition-colors duration-200 text-xs font-bold"
                style={{ border: "1px solid var(--border)", color: "var(--cream-dim)" }}
              >
                W
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <p className="section-tag mb-6">Shop</p>
            <ul className="flex flex-col gap-3">
              {LINKS.Shop.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm transition-colors duration-200"
                    style={{ color: "var(--cream-dim)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account links */}
          <div>
            <p className="section-tag mb-6">Account</p>
            <ul className="flex flex-col gap-3">
              {LINKS.Account.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm transition-colors duration-200"
                    style={{ color: "var(--cream-dim)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="section-tag mb-6">Contact</p>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <Mail size={14} className="mt-0.5 flex-shrink-0" style={{ color: "var(--gold)" }} />
                <span className="text-sm" style={{ color: "var(--cream-dim)" }}>
                  tejureddy6060@gmail.com
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={14} className="mt-0.5 flex-shrink-0" style={{ color: "var(--gold)" }} />
                <span className="text-sm" style={{ color: "var(--cream-dim)" }}>
                  +91 98660 52260
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" style={{ color: "var(--gold)" }} />
                <span className="text-sm" style={{ color: "var(--cream-dim)" }}>
                  Hyderabad, Telangana, India
                </span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-8">
              <p className="text-xs tracking-wider mb-3" style={{ color: "var(--cream-dim)" }}>
                Get updates on new arrivals
              </p>
              {subscribed ? (
                <p className="text-sm" style={{ color: "#4ade80" }}>✓ You're subscribed!</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex" style={{ border: "1px solid var(--border)" }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none"
                    style={{ color: "var(--cream)", caretColor: "var(--gold)" }}
                  />
                  <button type="submit" disabled={loading}
                    className="px-4 text-xs tracking-widest uppercase font-medium transition-colors duration-200 disabled:opacity-60"
                    style={{ background: "var(--gold)", color: "var(--bg)" }}
                  >
                    {loading ? "..." : "Join"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-16 pt-8"
          style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--cream-dim)" }}>
            © 2025 Thread Tales by Teju. All rights reserved.
          </p>
          <p className="text-xs flex items-center gap-1.5" style={{ color: "var(--cream-dim)" }}>
            Made with <Heart size={10} fill="var(--pink)" style={{ color: "var(--pink)" }} /> in Hyderabad
          </p>
        </div>
      </div>
    </footer>
  );
}
