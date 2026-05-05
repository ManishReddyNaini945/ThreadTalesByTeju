import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star, ChevronLeft, Share2, MessageCircle, Minus, Plus, Check, X, ZoomIn } from "lucide-react";
import { productService } from "../services/productService";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import api from "../services/api";
import CountdownTimer from "../components/CountdownTimer";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} size={14} className={s <= Math.round(rating) ? "fill-[#c8a45c]" : ""} style={{ color: s <= Math.round(rating) ? "var(--gold)" : "var(--border)" }} />
        ))}
      </div>
      <span className="text-sm" style={{ color: "var(--cream-dim)" }}>({count} reviews)</span>
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0"
          style={{ background: "rgba(200,164,92,0.15)", border: "1px solid var(--gold)", color: "var(--gold)" }}>
          {review.user_name?.[0]?.toUpperCase() || "A"}
        </div>
        <div>
          <p className="font-medium text-sm" style={{ color: "var(--cream)" }}>{review.user_name || "Anonymous"}</p>
          {review.is_verified_purchase && (
            <span className="text-xs text-green-400 flex items-center gap-1"><Check size={10} /> Verified Purchase</span>
          )}
        </div>
        <div className="ml-auto flex">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={12} className={s <= review.rating ? "fill-[#c8a45c]" : ""} style={{ color: s <= review.rating ? "var(--gold)" : "var(--border)" }} />
          ))}
        </div>
      </div>
      {review.title && <p className="font-medium text-sm mb-1" style={{ color: "var(--cream)" }}>{review.title}</p>}
      {review.body && <p className="text-sm leading-relaxed" style={{ color: "var(--cream-dim)" }}>{review.body}</p>}
    </div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, title: "", body: "" });
  const [customColor, setCustomColor] = useState("");
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyDone, setNotifyDone] = useState(false);
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [zoomOpen, setZoomOpen] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [pRes, rRes] = await Promise.all([
          productService.getProduct(slug),
          productService.getReviews(slug).catch(() => ({ data: [] })),
        ]);
        setProduct(pRes.data);
        setReviews(rRes.data || []);
        productService.getRelated(slug).then(({ data }) => setRelatedProducts(data)).catch(() => {});
        if (pRes.data.colors?.length) setSelectedColor(pRes.data.colors[0]);
        if (pRes.data.sizes?.length) setSelectedSize(pRes.data.sizes[0]);
      } catch {
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const effectiveColor = selectedColor || (customColor.trim() ? customColor.trim() : null);

  const handleAddToCart = async () => {
    if (product.colors?.length > 0 && !selectedColor && !customColor.trim()) {
      toast.error("Please select a color or enter your preferred color");
      return;
    }
    setAddingToCart(true);
    await addToCart(product.id, quantity, effectiveColor, selectedSize);
    setAddingToCart(false);
  };

  const handleNotify = async (e) => {
    e.preventDefault();
    if (!notifyEmail) return;
    setNotifyLoading(true);
    try {
      await api.post("/stock-notify", { product_id: product.id, email: notifyEmail });
      setNotifyDone(true);
      toast.success("We'll notify you when it's back in stock!");
    } catch { toast.error("Failed to subscribe. Try again."); }
    finally { setNotifyLoading(false); }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const res = await productService.createReview({ product_id: product.id, ...reviewData });
      setReviews((prev) => [res.data, ...prev]);
      setShowReviewForm(false);
      toast.success("Review submitted!");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to submit review");
    }
  };

  const whatsappMsg = product
    ? `Hi! I'm interested in *${product.name}* (₹${product.price}) from Thread Tales by Teju.${effectiveColor ? ` I'd like it in *${effectiveColor}* color.` : ""}${selectedSize ? ` Size: *${selectedSize}*.` : ""} Can you help me?`
    : "";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "var(--bg)" }}>
        <p className="mb-4" style={{ color: "var(--cream-dim)" }}>Product not found</p>
        <Link to="/" style={{ color: "var(--gold)" }} className="underline">Go home</Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : ["/placeholder.jpg"];
  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-16 sm:pt-28 pb-28 lg:pb-20">
        {/* Back button — mobile only */}
        <button onClick={() => window.history.back()}
          className="flex items-center gap-1 mb-4 lg:hidden text-xs tracking-widest uppercase transition-colors"
          style={{ color: "var(--cream-dim)" }}
          onTouchStart={e => e.currentTarget.style.color = "var(--gold)"}
          onTouchEnd={e => e.currentTarget.style.color = "var(--cream-dim)"}>
          <ChevronLeft size={14} /> Back
        </button>

        {/* Breadcrumb */}
        <nav className="hidden sm:flex items-center gap-2 text-xs tracking-widest uppercase mb-6 sm:mb-10 overflow-hidden">
          <Link to="/" className="flex-shrink-0 transition-colors" style={{ color: "var(--cream-dim)" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--cream-dim)"}>Home</Link>
          <span className="flex-shrink-0" style={{ color: "var(--border)" }}>/</span>
          <Link to="/shop" className="flex-shrink-0 transition-colors" style={{ color: "var(--cream-dim)" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--cream-dim)"}>Shop</Link>
          <span className="flex-shrink-0" style={{ color: "var(--border)" }}>/</span>
          <span className="truncate min-w-0" style={{ color: "var(--gold)" }}>{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-20">
          {/* Images */}
          <div className="space-y-4">
            <motion.div layoutId={`product-${product.id}`}
              className="aspect-square overflow-hidden relative group cursor-zoom-in"
              style={{ border: "1px solid var(--border)" }}
              onClick={() => setZoomOpen(true)}>
              <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "rgba(0,0,0,0.3)" }}>
                <ZoomIn size={32} color="#fff" />
              </div>
            </motion.div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 overflow-hidden transition-all"
                    style={{ border: `2px solid ${selectedImage === i ? "var(--gold)" : "var(--border)"}` }}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-4 sm:space-y-6">
            {product.category && (
              <Link to={`/shop?category=${product.category.slug}`}
                className="text-sm font-medium uppercase tracking-widest hover:underline" style={{ color: "var(--gold)" }}>
                {product.category.name}
              </Link>
            )}

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal leading-tight"
              style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>{product.name}</h1>

            <StarRating rating={product.avg_rating} count={product.review_count} />

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--cream)" }}>₹{product.price.toLocaleString()}</span>
                {product.compare_price && (
                  <>
                    <span className="text-lg line-through" style={{ color: "var(--cream-dim)" }}>₹{product.compare_price.toLocaleString()}</span>
                    <span className="px-2 py-0.5 text-xs font-medium" style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80", border: "1px solid #4ade8040" }}>
                      {discount}% off
                    </span>
                  </>
                )}
              </div>
              {product.sale_ends_at && <CountdownTimer endsAt={product.sale_ends_at} />}
            </div>

            {product.short_description && (
              <p className="leading-relaxed" style={{ color: "var(--cream-dim)" }}>{product.short_description}</p>
            )}

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium" style={{ color: "var(--cream)" }}>
                  Color:{" "}
                  <span style={{ color: "var(--gold)" }}>
                    {selectedColor || (customColor.trim() ? customColor.trim() : "")}
                  </span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((c) => (
                    <button key={c} onClick={() => { setSelectedColor(c); setCustomColor(""); }}
                      className="px-4 py-2.5 text-sm transition-all min-h-[44px]"
                      style={{
                        border: `1px solid ${selectedColor === c ? "var(--gold)" : "var(--border)"}`,
                        color: selectedColor === c ? "var(--gold)" : "var(--cream-dim)",
                        background: selectedColor === c ? "rgba(200,164,92,0.1)" : "transparent",
                      }}>
                      {c}
                    </button>
                  ))}
                </div>
                <div className="pt-1">
                  <p className="text-xs mb-1.5" style={{ color: "var(--cream-dim)" }}>
                    Want a different color? Type it below:
                  </p>
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => { setCustomColor(e.target.value); if (e.target.value.trim()) setSelectedColor(null); }}
                    placeholder="e.g. Peacock Green, Maroon, Navy Blue..."
                    className="w-full px-3 py-2 text-sm focus:outline-none"
                    style={{
                      background: "var(--bg-card)",
                      border: `1px solid ${customColor.trim() ? "var(--gold)" : "var(--border)"}`,
                      color: "var(--cream)",
                    }}
                    onFocus={e => e.target.style.borderColor = "var(--gold)"}
                    onBlur={e => { if (!customColor.trim()) e.target.style.borderColor = "var(--border)"; }}
                  />
                  {customColor.trim() && (
                    <p className="text-xs mt-1" style={{ color: "var(--gold)" }}>
                      Your custom color request will be noted. We'll confirm via WhatsApp.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: "var(--cream)" }}>
                  Size: <span style={{ color: "var(--gold)" }}>{selectedSize}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((s) => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      className="px-4 py-2.5 text-sm transition-all min-h-[44px] min-w-[56px]"
                      style={{
                        border: `1px solid ${selectedSize === s ? "var(--gold)" : "var(--border)"}`,
                        color: selectedSize === s ? "var(--gold)" : "var(--cream-dim)",
                        background: selectedSize === s ? "rgba(200,164,92,0.1)" : "transparent",
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-sm font-medium" style={{ color: "var(--cream)" }}>Quantity</p>
              <div className="flex items-center gap-3 px-4 py-2.5 min-h-[44px]" style={{ border: "1px solid var(--border)", background: "var(--bg-card)" }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="transition-colors p-1" style={{ color: "var(--cream-dim)" }}>
                  <Minus size={16} />
                </button>
                <span className="font-semibold w-6 text-center" style={{ color: "var(--cream)" }}>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  className="transition-colors p-1" style={{ color: "var(--cream-dim)" }}>
                  <Plus size={16} />
                </button>
              </div>
              <span className="text-xs" style={{ color: "var(--cream-dim)" }}>{product.stock_quantity} available</span>
            </div>

            {/* CTA buttons */}
            {product.stock_quantity === 0 ? (
              <div className="space-y-3">
                <p className="text-sm font-medium" style={{ color: "#f87171" }}>Currently Out of Stock</p>
                {notifyDone ? (
                  <p className="text-sm" style={{ color: "#4ade80" }}>✓ We'll email you when it's back!</p>
                ) : (
                  <form onSubmit={handleNotify} className="flex gap-2">
                    <input value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)}
                      type="email" placeholder="Enter your email" required
                      className="flex-1 px-4 py-3 text-sm focus:outline-none"
                      style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--cream)" }}
                      onFocus={e => e.target.style.borderColor = "var(--gold)"}
                      onBlur={e => e.target.style.borderColor = "var(--border)"} />
                    <button type="submit" disabled={notifyLoading} className="btn-gold px-4 py-3 text-xs disabled:opacity-60">
                      {notifyLoading ? "..." : "Notify Me"}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="space-y-3 lg:hidden">
                {/* Mobile: full-width Add to Cart */}
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleAddToCart} disabled={addingToCart}
                  className="btn-gold w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50 text-sm">
                  <ShoppingBag size={18} />
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </motion.button>
                <div className="flex gap-3">
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => toggleWishlist(product.id)}
                    className="flex-1 py-3 flex items-center justify-center gap-2 text-sm transition-all"
                    style={{
                      border: `1px solid ${isWishlisted(product.id) ? "#f87171" : "var(--border)"}`,
                      color: isWishlisted(product.id) ? "#f87171" : "var(--cream-dim)",
                      background: isWishlisted(product.id) ? "rgba(248,113,113,0.1)" : "transparent",
                    }}>
                    <Heart size={16} className={isWishlisted(product.id) ? "fill-[#f87171]" : ""} />
                    Wishlist
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.97 }}
                    onClick={() => window.open(`https://wa.me/919866052260?text=${encodeURIComponent(whatsappMsg)}`, "_blank")}
                    className="flex-1 py-3 flex items-center justify-center gap-2 text-sm transition-colors"
                    style={{ border: "1px solid #4ade80", color: "#4ade80" }}>
                    <MessageCircle size={16} />
                    WhatsApp
                  </motion.button>
                </div>
              </div>
            )}

            {/* Desktop CTA — hidden on mobile */}
            {product.stock_quantity > 0 && (
              <div className="hidden lg:flex gap-3">
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleAddToCart} disabled={addingToCart}
                  className="btn-gold flex-1 py-4 flex items-center justify-center gap-2 disabled:opacity-50">
                  <ShoppingBag size={18} />
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => toggleWishlist(product.id)}
                  className="p-4 flex items-center justify-center transition-all"
                  style={{
                    border: `1px solid ${isWishlisted(product.id) ? "#f87171" : "var(--border)"}`,
                    color: isWishlisted(product.id) ? "#f87171" : "var(--cream-dim)",
                    background: isWishlisted(product.id) ? "rgba(248,113,113,0.1)" : "transparent",
                  }}>
                  <Heart size={20} className={isWishlisted(product.id) ? "fill-[#f87171]" : ""} />
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }}
                  onClick={() => window.open(`https://wa.me/919866052260?text=${encodeURIComponent(whatsappMsg)}`, "_blank")}
                  className="p-4 flex items-center justify-center transition-colors"
                  style={{ border: "1px solid #4ade80", color: "#4ade80" }}>
                  <MessageCircle size={20} />
                </motion.button>
              </div>
            )}

            <p className="text-xs text-center" style={{ color: "var(--cream-dim)" }}>Free shipping on orders above ₹500</p>

            {/* Description */}
            {product.description && (
              <div className="pt-6" style={{ borderTop: "1px solid var(--border)" }}>
                <h3 className="font-normal mb-3" style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>Description</h3>
                <p className="leading-relaxed text-sm" style={{ color: "var(--cream-dim)" }}>{product.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 sm:mt-20">
            <h2 className="text-xl sm:text-2xl font-normal mb-5 sm:mb-8" style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {relatedProducts.map((p) => (
                <Link key={p.id} to={`/product/${p.slug}`}
                  className="group overflow-hidden transition-all"
                  style={{ border: "1px solid var(--border)", background: "var(--bg-card)" }}>
                  <div className="aspect-square overflow-hidden">
                    <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-2 sm:p-3">
                    <p className="text-xs sm:text-sm font-medium line-clamp-2 mb-1 transition-colors group-hover:text-[#c8a45c]"
                      style={{ color: "var(--cream)" }}>{p.name}</p>
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold" style={{ color: "var(--gold)" }}>₹{p.price.toLocaleString()}</span>
                      {p.compare_price && (
                        <span className="text-xs line-through" style={{ color: "var(--cream-dim)" }}>₹{p.compare_price.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Reviews section */}
        <div className="mt-12 sm:mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-normal" style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
                Customer Reviews
              </h2>
              {reviews.length > 0 && (() => {
                const counts = [5,4,3,2,1].map((s) => ({ star: s, count: reviews.filter(r => r.rating === s).length }));
                const avg = (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);
                return (
                  <div className="mt-4 flex gap-6 items-start">
                    <div className="text-center">
                      <p className="text-4xl font-bold" style={{ color: "var(--gold)" }}>{avg}</p>
                      <div className="flex justify-center mt-1">
                        {[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= Math.round(avg) ? "fill-[#c8a45c]" : ""} style={{ color: s <= Math.round(avg) ? "var(--gold)" : "var(--border)" }} />)}
                      </div>
                      <p className="text-xs mt-1" style={{ color: "var(--cream-dim)" }}>{reviews.length} reviews</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {counts.map(({ star, count }) => (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-xs w-4" style={{ color: "var(--cream-dim)" }}>{star}★</span>
                          <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--border)" }}>
                            <div className="h-full rounded-full" style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : "0%", background: "var(--gold)" }} />
                          </div>
                          <span className="text-xs w-4 text-right" style={{ color: "var(--cream-dim)" }}>{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
            {user && (
              <button onClick={() => setShowReviewForm(!showReviewForm)}
                className="btn-outline px-5 py-2.5 text-sm">
                {showReviewForm ? "Cancel" : "Write a Review"}
              </button>
            )}
          </div>

          {/* Review form */}
          {showReviewForm && (
            <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmitReview}
              className="p-6 mb-6 space-y-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--cream-dim)" }}>Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setReviewData({ ...reviewData, rating: s })}>
                      <Star size={24} className={s <= reviewData.rating ? "fill-[#c8a45c]" : ""} style={{ color: s <= reviewData.rating ? "var(--gold)" : "var(--border)" }} />
                    </button>
                  ))}
                </div>
              </div>
              <input value={reviewData.title} onChange={(e) => setReviewData({ ...reviewData, title: e.target.value })}
                placeholder="Review title" className="w-full px-4 py-3 text-sm focus:outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--cream)" }}
                onFocus={e => e.target.style.borderColor = "var(--gold)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"} />
              <textarea value={reviewData.body} onChange={(e) => setReviewData({ ...reviewData, body: e.target.value })}
                rows={4} placeholder="Share your experience..." className="w-full px-4 py-3 text-sm focus:outline-none resize-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--cream)" }}
                onFocus={e => e.target.style.borderColor = "var(--gold)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"} />
              <button type="submit" className="btn-gold px-6 py-3 text-sm">Submit Review</button>
            </motion.form>
          )}

          {reviews.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
            </div>
          ) : (
            <p className="text-center py-12" style={{ color: "var(--cream-dim)" }}>
              No reviews yet. Be the first to review this product!
            </p>
          )}
        </div>
      </main>

      <Footer />

      {/* Sticky bottom bar — mobile only */}
      {product.stock_quantity > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden flex items-center gap-3 px-4 py-3"
          style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)" }}>
          <div className="flex-1 min-w-0">
            <p className="text-xs truncate" style={{ color: "var(--cream-dim)" }}>{product.name}</p>
            <p className="text-sm font-bold" style={{ color: "var(--gold)" }}>₹{product.price.toLocaleString()}</p>
          </div>
          <motion.button whileTap={{ scale: 0.97 }} onClick={handleAddToCart} disabled={addingToCart}
            className="btn-gold px-6 py-3 text-sm flex items-center gap-2 disabled:opacity-50 flex-shrink-0">
            <ShoppingBag size={16} />
            {addingToCart ? "Adding..." : "Add to Cart"}
          </motion.button>
        </div>
      )}

      {/* Image Zoom Lightbox */}
      {zoomOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.92)" }}
          onClick={() => setZoomOpen(false)}>
          <button className="absolute top-4 right-4 p-2 transition-colors"
            style={{ color: "#fff" }} onClick={() => setZoomOpen(false)}>
            <X size={28} />
          </button>
          <img src={images[selectedImage]} alt={product.name}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={e => e.stopPropagation()} />
          {images.length > 1 && (
            <div className="absolute bottom-4 flex gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={e => { e.stopPropagation(); setSelectedImage(i); }}
                  className="w-12 h-12 overflow-hidden transition-all"
                  style={{ border: `2px solid ${selectedImage === i ? "var(--gold)" : "rgba(255,255,255,0.3)"}` }}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
