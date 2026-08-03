import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Search, Sparkles, Gift, Truck, ShieldCheck } from "lucide-react";
import { productService } from "../services/productService";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const RAKHI_CATEGORY_SLUG = "rakhi";

const PERKS = [
  { icon: Gift, label: "Gift-ready packaging" },
  { icon: Truck, label: "Fast, tracked shipping" },
  { icon: ShieldCheck, label: "Handcrafted quality" },
];

export default function RakhiLandingPage() {
  const [products, setProducts] = useState([]);
  const [categoryActive, setCategoryActive] = useState(null); // null = still checking
  const [loading, setLoading] = useState(true);
  const gridRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    // The categories list only ever contains active, top-level categories —
    // so the Rakhi banner only renders when it's actually enabled in Admin.
    productService.getCategories()
      .then(({ data }) => {
        const isActive = (Array.isArray(data) ? data : []).some(c => c.slug === RAKHI_CATEGORY_SLUG);
        setCategoryActive(isActive);
        if (!isActive) return null;
        return productService.getProducts({ category_slug: RAKHI_CATEGORY_SLUG, page_size: 24, sort_by: "newest" })
          .then(({ data }) => setProducts(data.items || data.products || []));
      })
      .catch(() => setCategoryActive(false))
      .finally(() => setLoading(false));
  }, []);

  const scrollToGrid = () => gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />

      <main>
      {loading ? (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }} />
        </div>
      ) : !categoryActive ? (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 pt-20">
          <Search size={40} className="mb-4" style={{ color: "var(--border)" }} />
          <p className="text-lg mb-2" style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
            The Rakhi collection isn't available right now
          </p>
          <p className="text-sm mb-8" style={{ color: "var(--cream-dim)" }}>
            Check back soon, or explore the rest of our collections in the meantime.
          </p>
          <Link to="/shop" className="btn-gold">Browse All Products</Link>
        </div>
      ) : (
      <>
        {/* Festive hero banner */}
        <section
          className="relative overflow-hidden pt-28 sm:pt-32 pb-16 sm:pb-24"
          style={{
            background: "linear-gradient(135deg, #7a1f2b 0%, #a3272f 35%, #c8622c 70%, #d99a3d 100%)",
          }}
        >
          {/* Decorative motifs */}
          <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
            <div className="absolute -top-10 -left-10 w-56 h-56 rounded-full" style={{ background: "radial-gradient(circle, #ffd97a 0%, transparent 70%)" }} />
            <div className="absolute -bottom-16 -right-10 w-72 h-72 rounded-full" style={{ background: "radial-gradient(circle, #ffd97a 0%, transparent 70%)" }} />
          </div>
          <div className="pointer-events-none absolute inset-0 text-4xl sm:text-5xl flex items-center justify-around opacity-10 select-none" aria-hidden="true">
            <span>🧵</span><span>🎊</span><span>🪢</span><span>🎁</span><span>🧵</span>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs tracking-[0.25em] uppercase font-medium"
              style={{ background: "rgba(255,255,255,0.14)", color: "#ffe8b8", border: "1px solid rgba(255,232,184,0.4)" }}
            >
              <Sparkles size={13} /> Raksha Bandhan Collection
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-normal mb-4"
              style={{ fontFamily: "Playfair Display, serif", color: "#fff8ec" }}
            >
              Celebrate Raksha Bandhan
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center gap-1 mb-9"
            >
              <span
                className="text-2xl sm:text-3xl font-bold tracking-wide px-5 py-2"
                style={{ background: "#1a8a4a", color: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}
              >
                Flat 25% OFF
              </span>
              <p className="text-sm sm:text-base mt-3" style={{ color: "rgba(255,248,236,0.85)" }}>
                On the entire Rakhi collection — handcrafted, gift-ready, made with love.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <button
                onClick={scrollToGrid}
                className="inline-flex items-center gap-2 px-8 py-4 text-sm tracking-[0.2em] uppercase font-semibold transition-transform duration-200 hover:-translate-y-0.5"
                style={{ background: "#ffe8b8", color: "#7a1f2b", boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}
              >
                Shop Now <ArrowRight size={16} />
              </button>
            </motion.div>

            {/* Perks strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-12"
            >
              {PERKS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs sm:text-sm" style={{ color: "rgba(255,248,236,0.9)" }}>
                  <Icon size={15} />
                  {label}
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Product grid */}
        <section ref={gridRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-20 scroll-mt-20">
          <div className="flex flex-col items-center text-center mb-10">
            <p className="section-tag mb-3">Handpicked for the occasion</p>
            <h2 className="text-3xl sm:text-4xl font-normal" style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
              Shop the Rakhi Collection
            </h2>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16">
              <Search size={40} className="mx-auto mb-4" style={{ color: "var(--border)" }} />
              <p className="text-lg mb-2" style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
                The Rakhi collection is on its way
              </p>
              <p className="text-sm mb-8" style={{ color: "var(--cream-dim)" }}>
                Check back soon, or explore the rest of our collections in the meantime.
              </p>
              <Link to="/shop" className="btn-gold">Browse All Products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </section>
      </>
      )}
      </main>

      <Footer />
    </div>
  );
}
