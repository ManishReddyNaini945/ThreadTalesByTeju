import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function CartItemRow({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const img = item.product?.images?.[0] || "/placeholder.jpg";

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
      className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm">
      <Link to={`/product/${item.product?.slug}`}>
        <img src={img} alt={item.product?.name} className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={`/product/${item.product?.slug}`}
          className="font-medium text-brand-dark hover:text-brand-gold transition-colors line-clamp-2 text-sm lg:text-base">
          {item.product?.name}
        </Link>
        <div className="flex gap-2 mt-1 flex-wrap">
          {item.selected_color && (
            <span className="text-xs text-brand-dark/50 bg-brand-dark/5 px-2 py-0.5 rounded-full">{item.selected_color}</span>
          )}
          {item.selected_size && (
            <span className="text-xs text-brand-dark/50 bg-brand-dark/5 px-2 py-0.5 rounded-full">{item.selected_size}</span>
          )}
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 bg-brand-cream rounded-full px-3 py-1.5">
            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-brand-dark/60 hover:text-brand-dark transition-colors">
              <Minus size={14} />
            </button>
            <span className="text-brand-dark font-medium text-sm w-4 text-center">{item.quantity}</span>
            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-brand-dark/60 hover:text-brand-dark transition-colors">
              <Plus size={14} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-brand-dark">₹{(item.price_at_add * item.quantity).toLocaleString()}</span>
            <button onClick={() => removeFromCart(item.id)} className="text-brand-dark/30 hover:text-red-400 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CartPage() {
  const { cart, loading } = useCart();
  const shipping = cart.subtotal >= 500 || cart.subtotal === 0 ? 0 : 50;
  const total = cart.subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-serif text-brand-dark mb-8 flex items-center gap-3">
          <ShoppingBag size={28} className="text-brand-gold" /> Shopping Cart
          {cart.item_count > 0 && <span className="text-lg text-brand-dark/40">({cart.item_count} items)</span>}
        </h1>

        {cart.items.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingCart size={64} className="text-brand-dark/20 mx-auto mb-6" />
            <h2 className="text-xl font-serif text-brand-dark mb-3">Your cart is empty</h2>
            <p className="text-brand-dark/50 mb-8">Discover our beautiful handcrafted pieces</p>
            <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-dark text-brand-cream rounded-2xl font-medium hover:bg-brand-gold transition-colors">
              Start Shopping <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-3">
              <AnimatePresence>
                {cart.items.map((item) => <CartItemRow key={item.id} item={item} />)}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-6 shadow-sm sticky top-24 space-y-4">
                <h2 className="text-lg font-semibold text-brand-dark">Order Summary</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-brand-dark/70">
                    <span>Subtotal</span><span>₹{cart.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-brand-dark/70">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-600">FREE</span> : `₹${shipping}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-brand-gold">Add ₹{(500 - cart.subtotal).toFixed(0)} more for free shipping</p>
                  )}
                </div>
                <div className="border-t border-brand-dark/10 pt-4 flex justify-between font-bold text-brand-dark">
                  <span>Total</span><span>₹{total.toLocaleString()}</span>
                </div>
                <Link to="/checkout"
                  className="w-full py-4 bg-brand-dark text-brand-cream rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-brand-gold transition-colors text-center block">
                  Proceed to Checkout <ArrowRight size={16} />
                </Link>
                <Link to="/shop" className="block text-center text-sm text-brand-gold hover:underline">Continue Shopping</Link>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
