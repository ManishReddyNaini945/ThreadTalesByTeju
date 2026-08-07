import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Search, Sparkles, Gift, Truck, ShieldCheck, ChevronDown, ChevronRight } from "lucide-react";
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
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [productsLoading, setProductsLoading] = useState(true);
  const [categoryActive, setCategoryActive] = useState(null); // null = still checking
  const [loading, setLoading] = useState(true);
  const gridRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    // The categories list only ever contains active, top-level categories —
    // so the Rakhi banner only renders when it's actually enabled in Admin.
    productService.getCategories()
      .then(({ data }) => {
        setCategoryActive((Array.isArray(data) ? data : []).some(c => c.slug === RAKHI_CATEGORY_SLUG));
      })
      .catch(() => setCategoryActive(false))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!categoryActive) return;
    setProductsLoading(true);
    productService.getProducts({ category_slug: RAKHI_CATEGORY_SLUG, page, page_size: 20, sort_by: sortBy })
      .then(({ data }) => {
        setProducts(data.items || data.products || []);
        setTotal(data.total || 0);
      })
      .catch(() => { setProducts([]); setTotal(0); })
      .finally(() => setProductsLoading(false));
  }, [categoryActive, page, sortBy]);

  const scrollToGrid = () => gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const goToPage = (p) => {
    setPage(p);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />

      {/* Breadcrumb / back link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-20 sm:pt-24">
        <nav className="flex items-center gap-2 text-xs tracking-widest uppercase" style={{ color: "var(--cream-dim)" }}>
          <Link to="/" className="hover:text-[var(--gold)] transition-colors">Home</Link>
          <ChevronRight size={11} />
          <span style={{ color: "var(--gold)" }}>Rakhi</span>
        </nav>
      </div>

      <main>
      {loading ? (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }} />
        </div>
      ) : !categoryActive ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
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
          className="relative overflow-hidden pt-10 sm:pt-14 pb-16 sm:pb-24"
          style={{ background: "var(--bg)" }}
        >
          {/* Subtle festive glow — same restrained treatment as the rest of the site */}
          <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true">
            <div className="absolute -top-24 -left-16 w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)", filter: "blur(70px)" }} />
            <div className="absolute -bottom-24 -right-16 w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, var(--pink) 0%, transparent 70%)", filter: "blur(70px)" }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs tracking-[0.25em] uppercase font-medium"
              style={{ background: "rgba(200,164,92,0.1)", color: "var(--gold)", border: "1px solid rgba(200,164,92,0.35)" }}
            >
              <Sparkles size={13} /> Raksha Bandhan Collection
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-normal mb-4"
              style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}
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
                className="text-xl sm:text-2xl font-bold tracking-wide px-5 py-2"
                style={{ background: "rgba(74,222,128,0.12)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.4)" }}
              >
                Minimum 25% OFF
              </span>
              <p className="text-sm sm:text-base mt-3" style={{ color: "var(--cream-dim)" }}>
                On the entire Rakhi collection — handcrafted, gift-ready, made with love.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <button onClick={scrollToGrid} className="btn-gold">
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
                <div key={label} className="flex items-center gap-2 text-xs sm:text-sm" style={{ color: "var(--cream-dim)" }}>
                  <Icon size={15} style={{ color: "var(--gold)" }} />
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

          {products.length > 0 && (
            <div className="flex justify-end mb-6">
              <div className="relative">
                <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                  className="appearance-none pl-3 pr-7 py-2.5 text-sm outline-none cursor-pointer"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--cream)" }}>
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--cream-dim)" }} />
              </div>
            </div>
          )}

          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {Array(8).fill(0).map((_, i) => (
                <div key={i}>
                  <div className="skeleton mb-4" style={{ aspectRatio: "1/1" }} />
                  <div className="skeleton h-3 w-2/3 mb-2" />
                  <div className="skeleton h-4 w-full mb-2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
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
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {products.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>

              {/* Pagination */}
              {total > 20 && (
                <div className="flex justify-center gap-2 mt-14">
                  {Array(Math.ceil(total / 20)).fill(0).map((_, i) => (
                    <button key={i} onClick={() => goToPage(i + 1)}
                      className="w-10 h-10 text-sm font-medium transition-all duration-200"
                      style={{
                        background: page === i + 1 ? "var(--gold)" : "var(--bg-card)",
                        color: page === i + 1 ? "var(--bg)" : "var(--cream-dim)",
                        border: "1px solid var(--border)",
                      }}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </>
      )}
      </main>

      <Footer />
    </div>
  );
}
