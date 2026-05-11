import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Layers } from "lucide-react";
import { productService } from "../services/productService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const gold = "var(--gold)";
const cream = "var(--cream)";
const creamDim = "var(--cream-dim)";
const cardBg = "var(--bg-card)";
const border = "var(--border)";
const bg = "var(--bg)";

function SubcategoryCard({ category, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link
        to={`/shop?category=${category.slug}`}
        className="group flex flex-col overflow-hidden transition-all duration-300"
        style={{ background: cardBg, border: `1px solid ${border}` }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = gold;
          e.currentTarget.style.boxShadow = "0 0 28px rgba(200,164,92,0.12)";
          e.currentTarget.style.transform = "translateY(-4px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = border;
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {/* Image or placeholder */}
        <div
          className="relative overflow-hidden flex items-center justify-center"
          style={{ aspectRatio: "4/3", background: bg }}
        >
          {category.image_url ? (
            <img
              src={category.image_url}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 opacity-30">
              <Layers size={36} style={{ color: gold }} />
            </div>
          )}
          {/* Hover overlay */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: "linear-gradient(to top, rgba(12,10,9,0.6) 0%, transparent 60%)" }}
          />
        </div>

        {/* Label */}
        <div className="flex items-center justify-between px-4 py-3.5">
          <span
            className="text-sm font-medium tracking-wide"
            style={{ fontFamily: "Playfair Display, serif", color: cream }}
          >
            {category.name}
          </span>
          <ChevronRight
            size={15}
            className="transition-transform duration-200 group-hover:translate-x-1"
            style={{ color: gold }}
          />
        </div>
      </Link>
    </motion.div>
  );
}

export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [parentCategory, setParentCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
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
        // If no subcategories, go straight to product listing
        if (!match.children || match.children.length === 0) {
          navigate(`/shop?category=${slug}`, { replace: true });
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug, navigate]);

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
        {!loading && !notFound && parentCategory && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-10">
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

        {/* Loading skeleton */}
        {loading && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse" style={{ border: `1px solid ${border}` }}>
                  <div className="w-full" style={{ aspectRatio: "4/3", background: cardBg }} />
                  <div className="px-4 py-3.5">
                    <div className="h-3 rounded w-3/4" style={{ background: cardBg }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Not found */}
        {!loading && notFound && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-20 text-center">
            <p className="text-sm tracking-widest uppercase mb-4" style={{ color: creamDim }}>
              Category not found
            </p>
            <Link to="/shop" className="btn-gold">
              Browse All Products
            </Link>
          </section>
        )}

        {/* Subcategory cards */}
        {!loading && !notFound && subcategories.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-20">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {subcategories.map((cat, i) => (
                <SubcategoryCard key={cat.id} category={cat} index={i} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
