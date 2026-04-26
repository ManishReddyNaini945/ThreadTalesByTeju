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
      className="bg-white rounded-3xl overflow-hidden shadow-sm group">
      <Link to={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden">
        <img src={img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {discount && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">{discount}% off</span>
        )}
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.slug}`} className="font-medium text-brand-dark hover:text-brand-gold transition-colors line-clamp-2 text-sm">
          {product.name}
        </Link>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold text-brand-dark">₹{product.price.toLocaleString()}</span>
          {product.compare_price && (
            <span className="text-xs text-brand-dark/40 line-through">₹{product.compare_price.toLocaleString()}</span>
          )}
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={() => addToCart(product.id)}
            className="flex-1 py-2.5 bg-brand-dark text-brand-cream rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-brand-gold transition-colors">
            <ShoppingBag size={14} /> Add to Cart
          </button>
          <button onClick={() => toggleWishlist(product.id)}
            className="p-2.5 rounded-xl border border-red-200 text-red-400 hover:bg-red-50 transition-colors">
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
    <div className="min-h-screen bg-brand-cream">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-serif text-brand-dark mb-8 flex items-center gap-3">
          <Heart size={28} className="text-brand-gold fill-brand-gold" /> My Wishlist
          {wishlistItems.length > 0 && (
            <span className="text-lg text-brand-dark/40">({wishlistItems.length} items)</span>
          )}
        </h1>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-24">
            <Heart size={64} className="text-brand-dark/20 mx-auto mb-6" />
            <h2 className="text-xl font-serif text-brand-dark mb-3">Your wishlist is empty</h2>
            <p className="text-brand-dark/50 mb-8">Save your favorite pieces here</p>
            <Link to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-dark text-brand-cream rounded-2xl font-medium hover:bg-brand-gold transition-colors">
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
