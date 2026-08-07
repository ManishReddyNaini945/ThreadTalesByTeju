import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Search, ChevronDown } from "lucide-react";
import { productService } from "../services/productService";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const gold = "var(--gold)";
const cream = "var(--cream)";
const creamDim = "var(--cream-dim)";
const border = "var(--border)";
const bg = "var(--bg)";

export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [parentCategory, setParentCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [catLoading, setCatLoading] = useState(true);

  const [activeSlug, setActiveSlug] = useState(slug); // which category_slug to fetch products for; starts as "All" (parent)
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCatLoading(true);
    productService.getCategories()
      .then(({ data }) => {
        const match = data.find((c) => c.slug === slug);
        if (!match) {
          // Maybe it's a subcategory slug — redirect to shop
          const isSub = data.some((c) => c.children?.some((ch) => ch.slug === slug));
          if (isSub) {
            navigate(`/shop?category=${slug}`, { replace: true });
          } else {
            setNotFound(true);
          }
          return;
        }
        setParentCategory(match);
        setSubcategories(match.children || []);
        setActiveSlug(slug);
        setPage(1);
        // If no subcategories, go straight to product listing
        if (!match.children || match.children.length === 0) {
          navigate(`/shop?category=${slug}`, { replace: true });
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setCatLoading(false));
  }, [slug, navigate]);

  useEffect(() => {
    if (!parentCategory || subcategories.length === 0) return;
    setLoading(true);
    productService.getProducts({ category_slug: activeSlug, page, page_size: 20, sort_by: sortBy })
      .then(({ data }) => {
        setProducts(data.items || data.products || []);
        setTotal(data.total || 0);
      })
      .catch(() => { setProducts([]); setTotal(0); })
      .finally(() => setLoading(false));
  }, [activeSlug, page, sortBy, parentCategory, subcategories.length]);

  const selectTab = (tabSlug) => {
    setActiveSlug(tabSlug);
    setPage(1);
  };

  return (
    <div className="min-h-screen" style={{ background: bg }}>
      <Navbar />

      <main className="pt-20 sm:pt-24">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-6">
          <nav className="flex items-center gap-2 text-xs tracking-widest uppercase" style={{ color: creamDim }}>
            <Link to="/" className="hover:text-[var(--gold)] transition-colors">Home</Link>
            <ChevronRight size={11} />
            <span style={{ color: gold }}>{parentCategory?.name || slug}</span>
          </nav>
        </div>

        {/* Hero heading */}
        {!catLoading && !notFound && parentCategory && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="section-tag mb-3">Browse by type</p>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-normal mb-3"
                style={{ fontFamily: "Playfair Display, serif", color: cream }}
              >
                {parentCategory.name}
              </h1>
              {parentCategory.description && (
                <p className="text-sm max-w-xl leading-relaxed" style={{ color: creamDim }}>
                  {parentCategory.description}
                </p>
              )}
              <div className="mt-4 w-12 h-px" style={{ background: gold }} />
            </motion.div>
          </section>
        )}

        {/* Loading skeleton (category lookup) */}
        {catLoading && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <div className="skeleton mb-4" style={{ aspectRatio: "1/1" }} />
                  <div className="skeleton h-3 w-2/3 mb-2" />
                  <div className="skeleton h-4 w-full mb-2" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Not found */}
        {!catLoading && notFound && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-20 text-center">
            <p className="text-sm tracking-widest uppercase mb-4" style={{ color: creamDim }}>
              Category not found
            </p>
            <Link to="/shop" className="btn-gold">
              Browse All Products
            </Link>
          </section>
        )}

        {!catLoading && !notFound && parentCategory && subcategories.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-20">
            {/* Subcategory tabs — All first, then each subcategory — plus sort */}
            <div className="flex items-center justify-between gap-4 mb-8" style={{ borderBottom: `1px solid ${border}` }}>
              <div className="flex gap-2 overflow-x-auto">
                <button onClick={() => selectTab(slug)}
                  className="flex-shrink-0 px-5 py-2.5 text-sm tracking-wide transition-all duration-200 border-b-2 -mb-px"
                  style={{
                    color: activeSlug === slug ? gold : creamDim,
                    borderBottomColor: activeSlug === slug ? gold : "transparent",
                  }}>
                  All
                </button>
                {subcategories.map((c) => (
                  <button key={c.id} onClick={() => selectTab(c.slug)}
                    className="flex-shrink-0 px-5 py-2.5 text-sm tracking-wide transition-all duration-200 border-b-2 -mb-px whitespace-nowrap"
                    style={{
                      color: activeSlug === c.slug ? gold : creamDim,
                      borderBottomColor: activeSlug === c.slug ? gold : "transparent",
                    }}>
                    {c.name}
                  </button>
                ))}
              </div>

              <div className="relative flex-shrink-0 mb-2">
                <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                  className="appearance-none pl-3 pr-7 py-2.5 text-sm outline-none cursor-pointer"
                  style={{ background: "var(--bg-card)", border: `1px solid ${border}`, color: cream }}>
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: creamDim }} />
              </div>
            </div>

            {/* Products grid */}
            {loading ? (
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
              <div className="text-center py-24">
                <Search size={40} className="mx-auto mb-4" style={{ color: border }} />
                <p className="text-lg mb-2" style={{ fontFamily: "Playfair Display, serif", color: cream }}>
                  No products found
                </p>
                <p className="text-sm" style={{ color: creamDim }}>
                  Nothing here yet — check back soon.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {products.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}

            {/* Pagination */}
            {total > 20 && (
              <div className="flex justify-center gap-2 mt-14">
                {Array(Math.ceil(total / 20)).fill(0).map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)}
                    className="w-10 h-10 text-sm font-medium transition-all duration-200"
                    style={{
                      background: page === i + 1 ? gold : "var(--bg-card)",
                      color: page === i + 1 ? bg : creamDim,
                      border: `1px solid ${border}`,
                    }}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
