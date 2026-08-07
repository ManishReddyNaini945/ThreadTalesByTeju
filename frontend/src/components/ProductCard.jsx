import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ProductShareButton from "./ProductShareButton";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [adding, setAdding] = useState(false);
  const firstColorImg = product.color_images
    ? Object.values(product.color_images).find(arr => arr?.length)?.[0]
    : null;
  const img = product.images?.[0] || firstColorImg || "";
  const wishlisted = isWishlisted?.(product.id);

  const goToProduct = () => navigate(`/product/${product.slug}`);

  const handleCart = async (e) => {
    e.stopPropagation();
    setAdding(true);
    try { await addToCart(product.id, 1); } catch {}
    finally { setTimeout(() => setAdding(false), 800); }
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group cursor-pointer"
      role="link"
      tabIndex={0}
      onClick={goToProduct}
      onKeyDown={(e) => { if (e.key === "Enter") goToProduct(); }}
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
      <div className="relative overflow-hidden" style={{ aspectRatio: "1/1", background: "var(--bg)" }}>
        {img && (
          <img src={img} alt={product.name} loading="lazy"
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
            {product.is_new_arrival && !product.is_bestseller && (
              <span className="px-2.5 py-1 text-[10px] tracking-widest uppercase font-medium"
                style={{ background: "#fff", color: "#0c0a09" }}>New</span>
            )}
            {product.compare_price && product.compare_price > product.price && (
              <span className="px-2.5 py-1 text-[10px] tracking-widest uppercase font-bold"
                style={{ background: "#16a34a", color: "#fff" }}>
                {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% off
              </span>
            )}
          </div>

        {/* Share + wishlist icons — top right */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
          <ProductShareButton
            product={product}
            className="w-9 h-9"
            style={{ background: "rgba(12,10,9,0.85)", border: "1px solid var(--border)", color: "var(--cream-dim)" }}
          />
          <button onClick={() => toggleWishlist?.(product.id)}
            className="w-9 h-9 flex items-center justify-center transition-all duration-300"
            style={{ background: "rgba(12,10,9,0.85)", border: "1px solid var(--border)" }}>
            <Heart size={13} fill={wishlisted ? "var(--pink)" : "none"}
              style={{ color: wishlisted ? "var(--pink)" : "var(--cream-dim)" }} />
          </button>
        </div>
      </div>

      {/* Info panel + Add to Cart below image */}
      <div className="p-3" style={{ borderTop: "1px solid var(--border)" }}>
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--gold)" }}>
            {product.category?.name}
          </p>
          <h3 className="text-sm font-normal mb-2 leading-snug line-clamp-2"
            style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
            {product.name}
          </h3>
          {(() => {
            const isWeightBased = product.pricing_unit === "gram" || product.pricing_unit === "kg";
            const isSizeBased = product.pricing_unit === "ml" || product.pricing_unit === "metre" || product.pricing_unit === "bangle";
            const pkg = product.sizes?.[0];
            const pkgGrams = isWeightBased && pkg
              ? pkg.endsWith("kg") ? parseFloat(pkg) * 1000 : parseFloat(pkg)
              : null;
            const perKg = pkgGrams
              ? (product.price / pkgGrams) * 1000
              : product.pricing_unit === "gram" ? product.price * 1000 : null;
            const sizeList = isSizeBased && product.sizes?.length > 0 ? product.sizes : null;
            const sizePriceValues = isSizeBased
              ? Object.values(product.size_prices || {}).filter(v => v > 0)
              : [];
            const startingPrice = sizePriceValues.length > 0 ? Math.min(...sizePriceValues) : null;
            return (
              <>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-sm" style={{ color: "var(--gold)" }}>
                    {isSizeBased
                      ? startingPrice
                        ? <>from ₹{startingPrice}</>
                        : <>₹{product.price}</>
                      : <>
                          ₹{product.price}
                          {isWeightBased && pkg && <span className="text-[10px] font-normal">/{pkg}</span>}
                          {product.pricing_unit === "gram" && !pkg && <span className="text-[10px] font-normal">/gram</span>}
                          {product.pricing_unit === "kg"   && !pkg && <span className="text-[10px] font-normal">/kg</span>}
                        </>
                    }
                  </span>
                  {product.compare_price && product.compare_price > product.price && (
                    <span className="text-xs line-through" style={{ color: "var(--cream-dim)" }}>
                      MRP ₹{product.compare_price}
                    </span>
                  )}
                </div>
                {product.compare_price && product.compare_price > product.price && (
                  <p className="text-[11px] font-medium mb-2" style={{ color: "#4ade80" }}>
                    Save ₹{(product.compare_price - product.price).toLocaleString()}
                  </p>
                )}
                {isSizeBased && sizeList && (
                  <p className="text-[10px] mb-2" style={{ color: "var(--cream-dim)" }}>
                    {sizeList.join(" · ")}
                  </p>
                )}
                {!isSizeBased && perKg && (
                  <p className="text-[10px] mb-2" style={{ color: "var(--cream-dim)" }}>
                    ₹{perKg.toLocaleString()}/kg
                  </p>
                )}
                {product.pricing_unit === "kg" && !pkg && (
                  <p className="text-[10px] mb-2" style={{ color: "var(--cream-dim)" }}>
                    ₹{(product.price / 1000).toFixed(3)}/gram
                  </p>
                )}
                {product.pricing_unit === "piece" && !product.compare_price && <div className="mb-3" />}
              </>
            );
          })()}
        </div>

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
