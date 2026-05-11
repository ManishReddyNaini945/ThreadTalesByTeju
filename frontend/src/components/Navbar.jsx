import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, User, Search, Menu, X, ChevronDown, ChevronRight } from "lucide-react";
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
  {
    label: "Raw Materials",
    isMega: true,
    path: "/category/raw-materials",
    children: [
      { label: "Kundans",                      path: "/shop?category=kundans" },
      { label: "Bangles",                      path: "/shop?category=raw-bangles" },
      { label: "Silk Threads",                 path: "/shop?category=silk-threads" },
      { label: "Glues",                        path: "/shop?category=glues" },
      { label: "Charms",                       path: "/shop?category=charms" },
      { label: "Craft Chains",                  path: "/shop?category=raw-chains" },
      { label: "Lakshmi Coins",               path: "/shop?category=lakshmi-coins" },
      { label: "Tools",                        path: "/shop?category=tools" },
      { label: "Beads",                        path: "/shop?category=beads" },
      { label: "Raw Saree Pins",               path: "/shop?category=raw-saree-pins" },
      { label: "Hair Accessories",             path: "/shop?category=raw-hair-accessories" },
      { label: "Transparent Sheets",          path: "/shop?category=transparent-sheets" },
      { label: "Wax Sheets",                  path: "/shop?category=wax-sheets" },
      { label: "Loreal Pearls",               path: "/shop?category=loreal-pearls" },
      { label: "Earring Material",            path: "/shop?category=earring-material" },
      { label: "Wire",                         path: "/shop?category=wire" },
      { label: "MDF",                          path: "/shop?category=mdf" },
      { label: "Bracelet & Necklace Material", path: "/shop?category=bracelet-necklace-material" },
      { label: "Sequins",                      path: "/shop?category=sequins" },
      { label: "Clip Stones",                  path: "/shop?category=clip-stones" },
    ],
  },
  { label: "About", path: "/#about" },
  { label: "Contact", path: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState(null);
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
    setOpenMobileSection(null);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Handle all nav link clicks — hash scrolling + Home scroll-to-top
  const handleHashNav = (e, path) => {
    // Home: always scroll to top smoothly and clear any hash
    if (path === "/") {
      if (location.pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        navigate("/", { replace: true }); // clears the #about / #contact hash
      }
      setMenuOpen(false);
      return;
    }

    // Hash links like /#about, /#contact
    if (!path.startsWith("/#")) return;
    e.preventDefault();
    const id = path.slice(2); // "/#about" → "about"
    const scrollToEl = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    };
    if (location.pathname === "/") {
      navigate(path, { replace: true }); // update URL hash for isActive()
      scrollToEl();
    } else {
      navigate(path);
      setTimeout(scrollToEl, 350);
    }
    setMenuOpen(false);
  };

  // Active check: handles both regular paths and hash paths
  const isActive = (path) => {
    if (path.startsWith("/#")) {
      return location.pathname === "/" && location.hash === `#${path.slice(2)}`;
    }
    if (path === "/") {
      // Home is only active when on "/" with no hash
      return location.pathname === "/" && !location.hash;
    }
    return location.pathname === path;
  };

  // When transparent (hero area), use bright cream so icons/text are visible over images
  const iconColor = scrolled ? "var(--cream-dim)" : "var(--cream)";

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <div className="flex flex-col leading-none">
                <span
                  className="font-normal tracking-wide whitespace-nowrap"
                  style={{
                    fontFamily: "Playfair Display, serif",
                    color: "var(--gold)",
                    fontSize: "clamp(1.1rem, 4.5vw, 1.5rem)",
                  }}
                >
                  Thread Tales
                </span>
                <span className="text-[8px] tracking-[0.4em] uppercase mt-0.5"
                  style={{ color: scrolled ? "var(--cream-dim)" : "rgba(247,245,242,0.75)" }}>
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
                    <div className="absolute top-full left-0 right-0 h-3" />
                    <AnimatePresence>
                      {activeDropdown === link.label && (
                        link.isMega ? (
                          /* ── Raw Materials mega-menu (2-column grid) ── */
                          <motion.div
                            initial={{ opacity: 0, y: 12, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.97 }}
                            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute top-full right-0 overflow-hidden"
                            style={{
                              width: "420px",
                              background: "var(--bg-card)",
                              border: "1px solid var(--border)",
                              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                              marginTop: "2px",
                            }}
                          >
                            <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                              <Link
                                to={link.path}
                                className="text-xs tracking-widest uppercase font-medium"
                                style={{ color: "var(--gold)" }}
                              >
                                View All Raw Materials →
                              </Link>
                            </div>
                            <div className="grid grid-cols-2 p-2">
                              {link.children.map((child, i) => (
                                <motion.div
                                  key={child.label}
                                  initial={{ opacity: 0, x: -6 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.02, duration: 0.18 }}
                                >
                                  <Link
                                    to={child.path}
                                    className="flex items-center gap-2 px-3 py-2 text-sm transition-all duration-150 rounded-sm"
                                    style={{ color: "var(--cream-dim)" }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background = "rgba(200,164,92,0.08)";
                                      e.currentTarget.style.color = "var(--gold)";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background = "transparent";
                                      e.currentTarget.style.color = "var(--cream-dim)";
                                    }}
                                  >
                                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--gold)", opacity: 0.5 }} />
                                    {child.label}
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        ) : (
                          /* ── Regular dropdown ── */
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
                        )
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    to={link.path}
                    onClick={(e) => handleHashNav(e, link.path)}
                    className="text-sm tracking-wide transition-colors duration-200"
                    style={{ color: isActive(link.path) ? "var(--gold)" : "var(--cream-dim)" }}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-1 sm:gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center transition-colors duration-200"
                style={{ color: iconColor }}
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              <Link
                to="/wishlist"
                className="relative w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center"
                style={{ color: iconColor }}
                aria-label="Wishlist"
              >
                <Heart size={18} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-medium"
                    style={{ background: "var(--gold)", color: "var(--bg)" }}>
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center"
                style={{ color: iconColor }}
                aria-label="Cart"
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-medium"
                    style={{ background: "var(--gold)", color: "var(--bg)" }}>
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                to={user ? "/profile" : "/auth"}
                className="hidden sm:flex w-9 h-9 items-center justify-center"
                style={{ color: iconColor }}
                aria-label="Account"
              >
                <User size={18} />
              </Link>

              <button
                className="lg:hidden w-10 h-10 flex items-center justify-center"
                style={{ color: iconColor }}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menu"
              >
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
            className="fixed inset-0 z-[60] flex items-start justify-center pt-24 sm:pt-40 px-5 sm:px-6"
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
                className="absolute top-5 right-5 sm:top-8 sm:right-8 w-10 h-10 flex items-center justify-center"
                style={{ color: "var(--cream-dim)" }}>
                <X size={24} />
              </button>
              <p className="section-tag mb-6 sm:mb-8 text-center">What are you looking for?</p>
              <form onSubmit={handleSearch} className="relative">
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search bangles, chains, hair clips..."
                  className="w-full bg-transparent text-xl sm:text-2xl outline-none pb-4 border-b"
                  style={{
                    fontFamily: "Playfair Display, serif",
                    color: "var(--cream)",
                    borderColor: "var(--border)",
                    caretColor: "var(--gold)",
                    fontSize: "clamp(1.1rem, 5vw, 1.5rem)",
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

      {/* Mobile menu — full-screen slide-in */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop — below navbar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-16 sm:top-20 inset-x-0 bottom-0 z-30 lg:hidden"
              style={{ background: "rgba(0,0,0,0.55)" }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer — starts BELOW the navbar (top-16 mobile / top-20 sm) */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-16 sm:top-20 right-0 bottom-0 z-40 lg:hidden w-[min(85vw,360px)] flex flex-col overflow-y-auto"
              style={{ background: "var(--bg-card)", borderLeft: "1px solid var(--border)", borderTop: "1px solid var(--border)" }}
            >
              {/* Nav links */}
              <div className="px-6 pt-1 pb-2">
                {NAV_LINKS.map((link) =>
                  link.children ? (
                    <div key={link.label}>
                      <button
                        onClick={() => setOpenMobileSection(openMobileSection === link.label ? null : link.label)}
                        className="w-full flex items-center justify-between py-3.5 text-left"
                        style={{ borderBottom: "1px solid var(--border)" }}
                      >
                        <span className="text-base" style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
                          {link.label}
                        </span>
                        <ChevronRight
                          size={16}
                          style={{ color: "var(--gold)", transform: openMobileSection === link.label ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                        />
                      </button>
                      <AnimatePresence>
                        {openMobileSection === link.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            {link.isMega && (
                              <Link
                                to={link.path}
                                className="flex items-center gap-2 pt-2 pb-1 pl-4 text-xs tracking-widest uppercase"
                                style={{ color: "var(--gold)" }}
                              >
                                View All →
                              </Link>
                            )}
                            <div className="pb-2 pt-1 pl-4">
                              {link.children.map((child) => (
                                <Link
                                  key={child.label}
                                  to={child.path}
                                  className="flex items-center gap-2 py-2 text-sm"
                                  style={{ color: "var(--cream-dim)" }}
                                >
                                  <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--gold)", opacity: 0.6 }} />
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      key={link.label}
                      to={link.path}
                      onClick={(e) => handleHashNav(e, link.path)}
                      className="flex items-center py-3.5 text-base"
                      style={{
                        fontFamily: "Playfair Display, serif",
                        color: isActive(link.path) ? "var(--gold)" : "var(--cream)",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>

              {/* Bottom: Profile/Login + CTA */}
              <div className="px-6 pt-4 pb-6" style={{ borderTop: "1px solid var(--border)" }}>
                <Link
                  to={user ? "/profile" : "/auth"}
                  className="flex items-center gap-3 py-3 mb-3 text-sm"
                  style={{ color: "var(--cream-dim)", borderBottom: "1px solid var(--border)" }}
                >
                  <User size={16} style={{ color: "var(--gold)" }} />
                  {user ? "My Profile" : "Login / Sign up"}
                </Link>

                <Link to="/shop" className="btn-gold w-full justify-center flex">
                  Shop Now
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
