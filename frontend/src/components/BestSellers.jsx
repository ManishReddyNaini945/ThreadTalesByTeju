import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, ArrowRight, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import api from "../services/api";

function ProductCard({ product, index }) {
  const { addToCart } = useCart();
  const { addToWishlist, wishlistItems } = useWishlist();
  const [adding, setAdding] = useState(false);
  const isWishlisted = wishlistItems?.some((w) => w.product_id === product.id);
  const image = product.images?.[0] || "";

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setAdding(true);
    try { await addToCart(product.id, 1); } catch (err) { console.error(err); }
    finally { setTimeout(() => setAdding(false), 800); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="group block">
        {/* Image — clean, no overlay button */}
        <Link to={`/product/${product.slug}`} className="block">
          <div className="relative overflow-hidden" style={{ aspectRatio: "3/4", background: "var(--bg-card)" }}>
            {image && (
              <img
                src={image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.is_bestseller && (
                <span className="px-2.5 py-1 text-[10px] tracking-widest uppercase font-medium"
                  style={{ background: "var(--gold)", color: "var(--bg)" }}>
                  Bestseller
                </span>
              )}
              {product.is_featured && !product.is_bestseller && (
                <span className="px-2.5 py-1 text-[10px] tracking-widest uppercase font-medium"
                  style={{ background: "var(--bg-card)", color: "var(--cream)", border: "1px solid var(--border)" }}>
                  Featured
                </span>
              )}
            </div>

            {/* Wishlist icon — top right */}
            <button
              onClick={(e) => { e.preventDefault(); addToWishlist(product.id); }}
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center transition-all duration-300"
              style={{ background: "rgba(12,10,9,0.8)", border: "1px solid var(--border)" }}
            >
              <Heart
                size={14}
                fill={isWishlisted ? "var(--pink)" : "none"}
                style={{ color: isWishlisted ? "var(--pink)" : "var(--cream-dim)" }}
              />
            </button>
          </div>
        </Link>

        {/* Info + Add to Cart below image */}
        <div className="pt-3 pb-1">
          <Link to={`/product/${product.slug}`} className="block">
            <p className="text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--cream-dim)" }}>
              {product.category?.name}
            </p>
            <h3 className="text-sm font-normal mb-2 leading-snug line-clamp-2"
              style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base font-medium" style={{ color: "var(--gold)" }}>
                ₹{product.price}
              </span>
              {product.compare_price && (
                <span className="text-xs line-through" style={{ color: "var(--cream-dim)" }}>
                  ₹{product.compare_price}
                </span>
              )}
            </div>
          </Link>

          {/* Add to Cart — always visible below price */}
          <button
            onClick={handleAddToCart}
            className="w-full py-2.5 flex items-center justify-center gap-1.5 text-[11px] tracking-widest uppercase font-medium transition-colors duration-200"
            style={{ background: adding ? "var(--gold-dim)" : "var(--gold)", color: "var(--bg)" }}
          >
            <ShoppingBag size={12} />
            {adding ? "Added!" : "Add to Cart"}
          </button>

          {product.avg_rating > 0 && (
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={9}
                  fill={i < Math.round(product.avg_rating) ? "var(--gold)" : "none"}
                  style={{ color: "var(--gold)" }} />
              ))}
              <span className="text-[10px] ml-1" style={{ color: "var(--cream-dim)" }}>
                ({product.review_count})
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products/?is_bestseller=true&page_size=8")
      .then((res) => setProducts(res.data?.items || res.data?.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 lg:py-32" style={{ background: "var(--bg-2)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 lg:mb-16">
          <div>
            <p className="section-tag mb-4">Bestsellers</p>
            <h2 className="section-title">
              Loved by<br />
              Our Customers
            </h2>
          </div>
          <Link to="/shop?is_bestseller=true"
            className="inline-flex items-center gap-2 text-sm tracking-widest uppercase"
            style={{ color: "var(--gold)" }}>
            View All
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i}>
                <div className="skeleton mb-4" style={{ aspectRatio: "3/4" }} />
                <div className="skeleton h-3 w-3/4 mb-2" />
                <div className="skeleton h-4 w-full mb-2" />
                <div className="skeleton h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          /* Fallback if API has no bestseller flag yet */
          <div className="text-center py-20">
            <p style={{ color: "var(--cream-dim)" }}>Loading our bestsellers...</p>
            <Link to="/shop" className="btn-gold mt-6 inline-flex">Browse All Products</Link>
          </div>
        )}
      </div>
    </section>
  );
}
