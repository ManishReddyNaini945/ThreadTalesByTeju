import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, User, Search, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/shop" },
  {
    label: "Collections",
    children: [
      { label: "Thread Bangles", path: "/shop?category=thread-bangles" },
      { label: "Bridal Sets", path: "/shop?category=bridal-bangle-sets" },
      { label: "Chains", path: "/shop?category=chains" },
      { label: "Hair Accessories", path: "/shop?category=hair-accessories" },
      { label: "Invisible Chains", path: "/shop?category=invisible-chains" },
      { label: "Saree Pins", path: "/shop?category=saree-pins" },
    ],
  },
  { label: "About", path: "/#about" },
  { label: "Contact", path: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  const { wishlistItems } = useWishlist();
  const { user } = useAuth();

  const cartCount = cart?.item_count || 0;
  const wishlistCount = wishlistItems?.length || 0;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(12,10,9,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          boxShadow: scrolled ? "0 1px 0 rgba(45,40,36,0.6)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link to="/">
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-normal tracking-wide"
                  style={{ fontFamily: "Playfair Display, serif", color: "var(--gold)" }}>
                  Thread Tales
                </span>
                <span className="text-[9px] tracking-[0.4em] uppercase mt-0.5"
                  style={{ color: "var(--cream-dim)" }}>
                  by Teju
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className="flex items-center gap-1 text-sm tracking-wide transition-colors duration-200"
                      style={{ color: activeDropdown === link.label ? "var(--gold)" : "var(--cream-dim)" }}
                    >
                      {link.label}
                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-200 ${activeDropdown === link.label ? "rotate-180" : ""}`}
                      />
                    </button>
                    {/* Invisible bridge — fills gap so mouse doesn't leave hover zone */}
                    <div className="absolute top-full left-0 right-0 h-3" />
                    <AnimatePresence>
                      {activeDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 12, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.97 }}
                          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute top-full left-1/2 -translate-x-1/2 w-56 overflow-hidden"
                          style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)", marginTop: "2px" }}
                        >
                          {link.children.map((child, i) => (
                            <motion.div
                              key={child.label}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.04, duration: 0.2 }}
                            >
                              <Link
                                to={child.path}
                                className="flex items-center gap-3 px-5 py-3 text-sm group/item transition-all duration-200"
                                style={{ color: "var(--cream-dim)", borderBottom: i < link.children.length - 1 ? "1px solid rgba(45,40,36,0.4)" : "none" }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = "rgba(200,164,92,0.08)";
                                  e.currentTarget.style.color = "var(--gold)";
                                  e.currentTarget.style.paddingLeft = "24px";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = "transparent";
                                  e.currentTarget.style.color = "var(--cream-dim)";
                                  e.currentTarget.style.paddingLeft = "20px";
                                }}
                              >
                                <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--gold)", opacity: 0.5 }} />
                                {child.label}
                              </Link>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="text-sm tracking-wide transition-colors duration-200"
                    style={{ color: location.pathname === link.path ? "var(--gold)" : "var(--cream-dim)" }}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-5">
              <button onClick={() => setSearchOpen(true)} className="transition-colors duration-200"
                style={{ color: "var(--cream-dim)" }}>
                <Search size={18} />
              </button>

              <Link to="/wishlist" className="relative" style={{ color: "var(--cream-dim)" }}>
                <Heart size={18} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-medium"
                    style={{ background: "var(--gold)", color: "var(--bg)" }}>
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="relative" style={{ color: "var(--cream-dim)" }}>
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-medium"
                    style={{ background: "var(--gold)", color: "var(--bg)" }}>
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link to={user ? "/profile" : "/auth"} style={{ color: "var(--cream-dim)" }}>
                <User size={18} />
              </Link>

              <button className="lg:hidden" style={{ color: "var(--cream-dim)" }}
                onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-start justify-center pt-40 px-6"
            style={{ background: "rgba(12,10,9,0.98)" }}
            onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="w-full max-w-2xl"
            >
              <button onClick={() => setSearchOpen(false)}
                className="absolute top-8 right-8" style={{ color: "var(--cream-dim)" }}>
                <X size={24} />
              </button>
              <p className="section-tag mb-8 text-center">What are you looking for?</p>
              <form onSubmit={handleSearch} className="relative">
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search bangles, chains, hair clips..."
                  className="w-full bg-transparent text-2xl outline-none pb-4 border-b"
                  style={{
                    fontFamily: "Playfair Display, serif",
                    color: "var(--cream)",
                    borderColor: "var(--border)",
                    caretColor: "var(--gold)",
                  }}
                />
                <button type="submit" className="absolute right-0 bottom-4" style={{ color: "var(--gold)" }}>
                  <Search size={20} />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden flex flex-col pt-24 px-8 overflow-y-auto"
            style={{ background: "var(--bg-card)" }}
          >
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label} className="py-4 border-b" style={{ borderColor: "var(--border)" }}>
                  <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: "var(--gold)" }}>
                    {link.label}
                  </p>
                  <div className="flex flex-col gap-2">
                    {link.children.map((child) => (
                      <Link key={child.label} to={child.path} className="text-base py-1"
                        style={{ color: "var(--cream-dim)" }}>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={link.label} to={link.path}
                  className="py-5 text-2xl border-b"
                  style={{
                    fontFamily: "Playfair Display, serif",
                    color: "var(--cream)",
                    borderColor: "var(--border)",
                  }}
                >
                  {link.label}
                </Link>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
