import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function WishlistCard({ product }) {
  const { toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const img = product.images?.[0] || "/placeholder.jpg";
  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null;

  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      className="group overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      <Link to={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden">
        <img src={img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {discount && (
          <span className="absolute top-3 left-3 text-xs font-medium px-2 py-1"
            style={{ background: "#4ade80", color: "var(--bg)" }}>{discount}% off</span>
        )}
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.slug}`} className="font-medium text-sm line-clamp-2 transition-colors"
          style={{ color: "var(--cream)" }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--cream)"}>
          {product.name}
        </Link>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold" style={{ color: "var(--cream)" }}>₹{product.price.toLocaleString()}</span>
          {product.compare_price && (
            <span className="text-xs line-through" style={{ color: "var(--cream-dim)" }}>₹{product.compare_price.toLocaleString()}</span>
          )}
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={() => addToCart(product.id)}
            className="btn-gold flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs">
            <ShoppingBag size={14} /> Add to Cart
          </button>
          <button onClick={() => toggleWishlist(product.id)}
            className="p-2.5 transition-colors"
            style={{ border: "1px solid #f87171", color: "#f87171" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(248,113,113,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function WishlistPage() {
  const { wishlistItems } = useWishlist();

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-20">
        <div className="flex items-center gap-3 mb-10">
          <Heart size={24} style={{ color: "var(--gold)", fill: "var(--gold)" }} />
          <h1 className="text-3xl font-normal" style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
            My Wishlist
          </h1>
          {wishlistItems.length > 0 && (
            <span className="text-base" style={{ color: "var(--cream-dim)" }}>({wishlistItems.length} items)</span>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-24">
            <Heart size={64} className="mx-auto mb-6" style={{ color: "var(--border)" }} />
            <h2 className="text-xl font-normal mb-3" style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
              Your wishlist is empty
            </h2>
            <p className="mb-8" style={{ color: "var(--cream-dim)" }}>Save your favorite pieces here</p>
            <Link to="/shop" className="btn-gold inline-flex items-center gap-2">
              Explore Collection
            </Link>
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {wishlistItems.map((product) => (
                <WishlistCard key={product.id} product={product} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </main>
      <Footer />
    </div>
  );
}
