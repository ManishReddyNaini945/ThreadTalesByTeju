import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star, ChevronLeft, Share2, MessageCircle, Minus, Plus, Check } from "lucide-react";
import { productService } from "../services/productService";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} size={14} className={s <= Math.round(rating) ? "fill-brand-gold text-brand-gold" : "text-brand-dark/20"} />
        ))}
      </div>
      <span className="text-sm text-brand-dark/60">({count} reviews)</span>
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 bg-brand-gold/20 rounded-full flex items-center justify-center text-brand-gold font-semibold text-sm">
          {review.user_name?.[0]?.toUpperCase() || "A"}
        </div>
        <div>
          <p className="font-medium text-brand-dark text-sm">{review.user_name || "Anonymous"}</p>
          {review.is_verified_purchase && (
            <span className="text-xs text-green-600 flex items-center gap-1"><Check size={10} /> Verified Purchase</span>
          )}
        </div>
        <div className="ml-auto flex">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={12} className={s <= review.rating ? "fill-brand-gold text-brand-gold" : "text-brand-dark/20"} />
          ))}
        </div>
      </div>
      {review.title && <p className="font-medium text-brand-dark text-sm mb-1">{review.title}</p>}
      {review.body && <p className="text-brand-dark/70 text-sm leading-relaxed">{review.body}</p>}
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

  const handleAddToCart = async () => {
    setAddingToCart(true);
    await addToCart(product.id, quantity, selectedColor, selectedSize);
    setAddingToCart(false);
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
    ? `Hi! I'm interested in *${product.name}* (₹${product.price}) from Thread Tales by Teju. Can you help me customize it?`
    : "";

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center">
        <p className="text-brand-dark/60 mb-4">Product not found</p>
        <Link to="/" className="text-brand-gold underline">Go home</Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : ["/placeholder.jpg"];
  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null;

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 lg:py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-brand-dark/50 mb-8">
          <Link to="/" className="hover:text-brand-gold transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-brand-gold transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-brand-dark">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Images */}
          <div className="space-y-4">
            <motion.div layoutId={`product-${product.id}`}
              className="aspect-square rounded-3xl overflow-hidden bg-white shadow-sm">
              <img src={images[selectedImage]} alt={product.name}
                className="w-full h-full object-cover" />
            </motion.div>
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? "border-brand-gold" : "border-transparent"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {product.category && (
              <Link to={`/shop?category=${product.category.slug}`}
                className="text-brand-gold text-sm font-medium uppercase tracking-widest hover:underline">
                {product.category.name}
              </Link>
            )}

            <h1 className="text-3xl lg:text-4xl font-serif text-brand-dark leading-tight">{product.name}</h1>

            <StarRating rating={product.avg_rating} count={product.review_count} />

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-brand-dark">₹{product.price.toLocaleString()}</span>
              {product.compare_price && (
                <>
                  <span className="text-lg text-brand-dark/40 line-through">₹{product.compare_price.toLocaleString()}</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">{discount}% off</span>
                </>
              )}
            </div>

            {product.short_description && (
              <p className="text-brand-dark/70 leading-relaxed">{product.short_description}</p>
            )}

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-brand-dark mb-2">Color: <span className="text-brand-gold">{selectedColor}</span></p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((c) => (
                    <button key={c} onClick={() => setSelectedColor(c)}
                      className={`px-4 py-2 rounded-full text-sm border transition-all ${selectedColor === c ? "border-brand-gold bg-brand-gold/10 text-brand-dark font-medium" : "border-brand-dark/20 text-brand-dark/70 hover:border-brand-gold"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-brand-dark mb-2">Size: <span className="text-brand-gold">{selectedSize}</span></p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((s) => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 rounded-full text-sm border transition-all ${selectedSize === s ? "border-brand-gold bg-brand-gold/10 text-brand-dark font-medium" : "border-brand-dark/20 text-brand-dark/70 hover:border-brand-gold"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <p className="text-sm font-medium text-brand-dark">Quantity</p>
              <div className="flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-sm">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-brand-dark/60 hover:text-brand-dark transition-colors">
                  <Minus size={16} />
                </button>
                <span className="font-semibold text-brand-dark w-6 text-center">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))} className="text-brand-dark/60 hover:text-brand-dark transition-colors">
                  <Plus size={16} />
                </button>
              </div>
              <span className="text-sm text-brand-dark/40">{product.stock_quantity} available</span>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3">
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleAddToCart} disabled={addingToCart || product.stock_quantity === 0}
                className="flex-1 py-4 bg-brand-dark text-brand-cream rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-brand-gold transition-colors disabled:opacity-50">
                <ShoppingBag size={18} />
                {product.stock_quantity === 0 ? "Out of Stock" : addingToCart ? "Adding..." : "Add to Cart"}
              </motion.button>

              <motion.button whileTap={{ scale: 0.97 }} onClick={() => toggleWishlist(product.id)}
                className={`p-4 rounded-2xl border-2 transition-all ${isWishlisted(product.id) ? "border-red-400 bg-red-50 text-red-500" : "border-brand-dark/20 text-brand-dark/60 hover:border-brand-gold hover:text-brand-gold"}`}>
                <Heart size={20} className={isWishlisted(product.id) ? "fill-red-400" : ""} />
              </motion.button>

              <motion.button whileTap={{ scale: 0.97 }}
                onClick={() => window.open(`https://wa.me/919866052260?text=${encodeURIComponent(whatsappMsg)}`, "_blank")}
                className="p-4 rounded-2xl border-2 border-green-400 bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                <MessageCircle size={20} />
              </motion.button>
            </div>

            <p className="text-xs text-brand-dark/40 text-center">Free shipping on orders above ₹500</p>

            {/* Description */}
            {product.description && (
              <div className="border-t border-brand-dark/10 pt-6">
                <h3 className="font-semibold text-brand-dark mb-3">Description</h3>
                <p className="text-brand-dark/70 leading-relaxed text-sm">{product.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews section */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif text-brand-dark">Customer Reviews</h2>
            {user && (
              <button onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-5 py-2.5 border border-brand-gold text-brand-gold rounded-xl text-sm hover:bg-brand-gold hover:text-white transition-all">
                {showReviewForm ? "Cancel" : "Write a Review"}
              </button>
            )}
          </div>

          {/* Review form */}
          {showReviewForm && (
            <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmitReview}
              className="bg-white rounded-2xl p-6 shadow-sm mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setReviewData({ ...reviewData, rating: s })}>
                      <Star size={24} className={s <= reviewData.rating ? "fill-brand-gold text-brand-gold" : "text-brand-dark/20"} />
                    </button>
                  ))}
                </div>
              </div>
              <input value={reviewData.title} onChange={(e) => setReviewData({ ...reviewData, title: e.target.value })}
                placeholder="Review title" className="w-full px-4 py-3 rounded-xl border border-brand-dark/10 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 text-brand-dark" />
              <textarea value={reviewData.body} onChange={(e) => setReviewData({ ...reviewData, body: e.target.value })}
                rows={4} placeholder="Share your experience..."
                className="w-full px-4 py-3 rounded-xl border border-brand-dark/10 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 text-brand-dark resize-none" />
              <button type="submit" className="px-6 py-3 bg-brand-dark text-brand-cream rounded-xl text-sm font-medium hover:bg-brand-gold transition-colors">
                Submit Review
              </button>
            </motion.form>
          )}

          {reviews.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
            </div>
          ) : (
            <p className="text-brand-dark/40 text-center py-12">No reviews yet. Be the first to review this product!</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
