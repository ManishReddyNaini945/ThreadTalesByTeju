import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Heart, ShoppingBag, Star, X, ChevronDown } from "lucide-react";
import { productService } from "../services/productService";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useDebounce } from "../hooks/useDebounce";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [adding, setAdding] = useState(false);
  const img = product.images?.[0] || "";
  const wishlisted = isWishlisted?.(product.id);

  const handleCart = async (e) => {
    e.preventDefault();
    setAdding(true);
    try { await addToCart(product.id, 1); } catch {}
    finally { setTimeout(() => setAdding(false), 800); }
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group"
      style={{
        border: "1px solid var(--border)",
        background: "var(--bg-card)",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--gold)";
        e.currentTarget.style.boxShadow = "0 0 25px rgba(200,164,92,0.1)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Image — clean, full visibility */}
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden" style={{ aspectRatio: "1/1", background: "var(--bg)" }}>
          {img && (
            <img src={img} alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          )}

          {/* Hover gradient — desktop only */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: "linear-gradient(to top, rgba(12,10,9,0.5) 0%, transparent 60%)" }} />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.is_bestseller && (
              <span className="px-2.5 py-1 text-[10px] tracking-widest uppercase font-medium"
                style={{ background: "var(--gold)", color: "var(--bg)" }}>Bestseller</span>
            )}
            {product.is_featured && !product.is_bestseller && (
              <span className="px-2.5 py-1 text-[10px] tracking-widest uppercase"
                style={{ background: "rgba(12,10,9,0.85)", color: "var(--cream)", border: "1px solid var(--gold)" }}>Featured</span>
            )}
          </div>

          {/* Wishlist icon — top right */}
          <button onClick={(e) => { e.preventDefault(); toggleWishlist?.(product.id); }}
            className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center transition-all duration-300"
            style={{ background: "rgba(12,10,9,0.85)", border: "1px solid var(--border)" }}>
            <Heart size={13} fill={wishlisted ? "var(--pink)" : "none"}
              style={{ color: wishlisted ? "var(--pink)" : "var(--cream-dim)" }} />
          </button>
        </div>
      </Link>

      {/* Info panel + Add to Cart below image */}
      <div className="p-3" style={{ borderTop: "1px solid var(--border)" }}>
        <Link to={`/products/${product.id}`} className="block">
          <p className="text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--gold)" }}>
            {product.category?.name}
          </p>
          <h3 className="text-sm font-normal mb-2 leading-snug line-clamp-2"
            style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <span className="font-medium" style={{ color: "var(--gold)" }}>₹{product.price}</span>
            {product.compare_price && (
              <span className="text-xs line-through" style={{ color: "var(--cream-dim)" }}>₹{product.compare_price}</span>
            )}
          </div>
        </Link>

        {/* Add to Cart — below price, always tappable */}
        <button onClick={handleCart}
          className="w-full py-2.5 flex items-center justify-center gap-1.5 text-[11px] tracking-widest uppercase font-medium transition-colors duration-200"
          style={{ background: adding ? "var(--gold-dim)" : "var(--gold)", color: "var(--bg)" }}>
          <ShoppingBag size={12} />
          {adding ? "Added!" : "Add to Cart"}
        </button>

        {product.avg_rating > 0 && (
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={9} fill={i < Math.round(product.avg_rating) ? "var(--gold)" : "none"}
                style={{ color: "var(--gold)" }} />
            ))}
            <span className="text-[10px] ml-1" style={{ color: "var(--cream-dim)" }}>({product.review_count})</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  // Read filters directly from URL — always in sync
  const category = searchParams.get("category") || "";
  const isBestseller = searchParams.get("is_bestseller") === "true";
  const isFeatured = searchParams.get("is_featured") === "true";

  const setCategory = (slug) => {
    const p = new URLSearchParams(searchParams);
    if (slug) p.set("category", slug);
    else p.delete("category");
    setSearchParams(p);
    setPage(1);
  };

  useEffect(() => {
    productService.getCategories()
      .then(({ data }) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {
      page, page_size: 20, sort_by: sortBy,
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(category && { category_slug: category }),
      ...(minPrice && { min_price: Number(minPrice) }),
      ...(maxPrice && { max_price: Number(maxPrice) }),
      ...(isBestseller && { is_bestseller: true }),
      ...(isFeatured && { is_featured: true }),
    };
    productService.getProducts(params)
      .then(({ data }) => {
        setProducts(data.items || data.products || []);
        setTotal(data.total || 0);
      })
      .catch(() => { setProducts([]); setTotal(0); })
      .finally(() => setLoading(false));
  }, [debouncedSearch, category, minPrice, maxPrice, sortBy, page, isBestseller, isFeatured]);

  const clearFilters = () => {
    setSearch(""); setMinPrice(""); setMaxPrice(""); setSortBy("newest"); setPage(1);
    setSearchParams({});
  };

  const activeFilters = [
    search && { label: `"${search}"`, clear: () => setSearch("") },
    category && { label: categories.find((c) => c.slug === category)?.name || category, clear: () => setCategory("") },
    minPrice && { label: `Min ₹${minPrice}`, clear: () => setMinPrice("") },
    maxPrice && { label: `Max ₹${maxPrice}`, clear: () => setMaxPrice("") },
  ].filter(Boolean);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-24 sm:pt-32 pb-20">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-xs tracking-widest uppercase">
          <Link to="/" className="transition-colors duration-200" style={{ color: "var(--cream-dim)" }}>Home</Link>
          <span style={{ color: "var(--border)" }}>/</span>
          <span style={{ color: "var(--gold)" }}>Shop</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="section-tag mb-3">
              {isBestseller ? "Bestsellers" : isFeatured ? "Featured" : category ? categories.find(c => c.slug === category)?.name || category : "All Products"}
            </p>
            <h1 className="section-title">
              {isBestseller ? "Our Bestsellers" : isFeatured ? "Featured Products" : "Our Collection"}
            </h1>
            <p className="text-sm mt-2" style={{ color: "var(--cream-dim)" }}>{total} products</p>
          </div>

          {/* Controls — responsive on mobile */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            {/* Search */}
            <div className="relative flex-1 sm:flex-none">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--cream-dim)" }} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
                className="pl-9 pr-8 py-2.5 text-sm outline-none w-full sm:w-44"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--cream)", caretColor: "var(--gold)" }} />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--cream-dim)" }}>
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Filter + Sort row */}
            <div className="flex items-center gap-2">
              <button onClick={() => setShowFilters(!showFilters)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-sm transition-colors duration-200"
                style={{
                  background: showFilters ? "var(--gold)" : "var(--bg-card)",
                  color: showFilters ? "var(--bg)" : "var(--cream-dim)",
                  border: "1px solid var(--border)",
                }}>
                <SlidersHorizontal size={14} /> Filters
              </button>

              <div className="relative flex-1 sm:flex-none">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-3 sm:pl-4 pr-7 py-2.5 text-sm outline-none cursor-pointer w-full"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--cream)" }}>
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price ↑</option>
                  <option value="price_desc">Price ↓</option>
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--cream-dim)" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6">
              <div className="p-5 grid sm:grid-cols-3 gap-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "var(--cream-dim)" }}>Min Price (₹)</label>
                  <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0"
                    className="w-full px-3 py-2 text-sm outline-none"
                    style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--cream)" }} />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "var(--cream-dim)" }}>Max Price (₹)</label>
                  <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="5000"
                    className="w-full px-3 py-2 text-sm outline-none"
                    style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--cream)" }} />
                </div>
                <div className="flex items-end">
                  <button onClick={clearFilters} className="w-full py-2 px-4 text-sm transition-colors duration-200"
                    style={{ border: "1px solid var(--border)", color: "var(--cream-dim)" }}>
                    Clear All
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-5">
            {activeFilters.map((f, i) => (
              <button key={i} onClick={f.clear}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors duration-200"
                style={{ background: "var(--bg-card)", border: "1px solid var(--gold)", color: "var(--gold)" }}>
                {f.label} <X size={10} />
              </button>
            ))}
          </div>
        )}

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8"
          style={{ borderBottom: "1px solid var(--border)" }}>
          <button onClick={() => setCategory("")}
            className="flex-shrink-0 px-5 py-2.5 text-sm tracking-wide transition-all duration-200 border-b-2 -mb-px"
            style={{
              color: !category ? "var(--gold)" : "var(--cream-dim)",
              borderBottomColor: !category ? "var(--gold)" : "transparent",
            }}>
            All
          </button>
          {categories.map((c) => (
            <button key={c.id} onClick={() => setCategory(c.slug)}
              className="flex-shrink-0 px-5 py-2.5 text-sm tracking-wide transition-all duration-200 border-b-2 -mb-px whitespace-nowrap"
              style={{
                color: category === c.slug ? "var(--gold)" : "var(--cream-dim)",
                borderBottomColor: category === c.slug ? "var(--gold)" : "transparent",
              }}>
              {c.name}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array(8).fill(0).map((_, i) => (
              <div key={i}>
                <div className="skeleton mb-4" style={{ aspectRatio: "3/4" }} />
                <div className="skeleton h-3 w-2/3 mb-2" />
                <div className="skeleton h-4 w-full mb-2" />
                <div className="skeleton h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <Search size={40} className="mx-auto mb-4" style={{ color: "var(--border)" }} />
            <p className="text-lg mb-2" style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
              No products found
            </p>
            <p className="text-sm mb-8" style={{ color: "var(--cream-dim)" }}>
              Try adjusting your filters or browse all collections
            </p>
            <button onClick={clearFilters} className="btn-gold">Clear Filters</button>
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
                  background: page === i + 1 ? "var(--gold)" : "var(--bg-card)",
                  color: page === i + 1 ? "var(--bg)" : "var(--cream-dim)",
                  border: "1px solid var(--border)",
                }}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
