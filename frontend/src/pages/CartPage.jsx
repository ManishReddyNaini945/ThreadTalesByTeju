import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function CartItemRow({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const img = item.product?.images?.[0] || "";

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
      className="flex gap-5 p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>

      {/* Image */}
      <Link to={`/products/${item.product?.id}`} className="flex-shrink-0">
        <div className="w-24 h-24 overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          {img && <img src={img} alt={item.product?.name} className="w-full h-full object-cover" />}
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link to={`/products/${item.product?.id}`}
          className="text-sm font-normal leading-snug line-clamp-2 transition-colors duration-200 hover:text-gold"
          style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
          {item.product?.name}
        </Link>

        {(item.selected_color || item.selected_size) && (
          <div className="flex gap-2 mt-1.5">
            {item.selected_color && (
              <span className="text-[10px] tracking-widest uppercase px-2 py-0.5"
                style={{ border: "1px solid var(--border)", color: "var(--cream-dim)" }}>
                {item.selected_color}
              </span>
            )}
            {item.selected_size && (
              <span className="text-[10px] tracking-widest uppercase px-2 py-0.5"
                style={{ border: "1px solid var(--border)", color: "var(--cream-dim)" }}>
                {item.selected_size}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          {/* Quantity */}
          <div className="flex items-center" style={{ border: "1px solid var(--border)" }}>
            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center transition-colors duration-200"
              style={{ color: "var(--cream-dim)" }}>
              <Minus size={13} />
            </button>
            <span className="w-8 text-center text-sm font-medium" style={{ color: "var(--cream)" }}>
              {item.quantity}
            </span>
            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center transition-colors duration-200"
              style={{ color: "var(--cream-dim)" }}>
              <Plus size={13} />
            </button>
          </div>

          {/* Price + Delete */}
          <div className="flex items-center gap-4">
            <span className="font-medium" style={{ color: "var(--gold)" }}>
              ₹{((item.price_at_add || item.product?.price || 0) * item.quantity).toLocaleString()}
            </span>
            <button onClick={() => removeFromCart(item.id)}
              className="transition-colors duration-200"
              style={{ color: "var(--border)" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#e87070"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--border)"}>
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CartPage() {
  const { cart, loading } = useCart();
  const subtotal = cart?.subtotal || 0;
  const shipping = subtotal >= 500 || subtotal === 0 ? 0 : 50;
  const total = subtotal + shipping;

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 lg:px-10 pt-32 pb-20">

        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <ShoppingBag size={24} style={{ color: "var(--gold)" }} />
          <h1 className="text-3xl font-normal" style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
            Shopping Cart
            {cart?.item_count > 0 && (
              <span className="text-base ml-3" style={{ color: "var(--cream-dim)", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                ({cart.item_count} {cart.item_count === 1 ? "item" : "items"})
              </span>
            )}
          </h1>
        </div>

        {!cart?.items?.length ? (
          /* Empty state */
          <div className="text-center py-28">
            <ShoppingCart size={56} className="mx-auto mb-6" style={{ color: "var(--border)" }} />
            <h2 className="text-2xl font-normal mb-3"
              style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
              Your cart is empty
            </h2>
            <p className="text-sm mb-10" style={{ color: "var(--cream-dim)" }}>
              Discover our beautiful handcrafted pieces
            </p>
            <Link to="/shop" className="btn-gold inline-flex items-center gap-2">
              Start Shopping <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Cart items */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <AnimatePresence>
                {cart.items.map((item) => <CartItemRow key={item.id} item={item} />)}
              </AnimatePresence>

              <Link to="/shop"
                className="inline-flex items-center gap-2 text-sm mt-2 transition-colors duration-200"
                style={{ color: "var(--cream-dim)" }}>
                ← Continue Shopping
              </Link>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <h2 className="text-lg font-normal mb-6 pb-4"
                  style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)", borderBottom: "1px solid var(--border)" }}>
                  Order Summary
                </h2>

                <div className="flex flex-col gap-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span style={{ color: "var(--cream-dim)" }}>Subtotal</span>
                    <span style={{ color: "var(--cream)" }}>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "var(--cream-dim)" }}>Shipping</span>
                    <span style={{ color: shipping === 0 ? "#4ade80" : "var(--cream)" }}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs" style={{ color: "var(--gold)" }}>
                      Add ₹{(500 - subtotal).toFixed(0)} more for free shipping
                    </p>
                  )}
                </div>

                <div className="flex justify-between font-medium text-base py-4 mb-6"
                  style={{ borderTop: "1px solid var(--border)", color: "var(--cream)" }}>
                  <span>Total</span>
                  <span style={{ color: "var(--gold)" }}>₹{total.toLocaleString()}</span>
                </div>

                <Link to="/checkout" className="btn-gold w-full justify-center flex items-center gap-2 mb-4">
                  Proceed to Checkout <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
