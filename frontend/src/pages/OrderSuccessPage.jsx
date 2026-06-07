import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Package, MessageCircle, Home, ArrowRight } from "lucide-react";
import { orderService } from "../services/orderService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);

  useEffect(() => {
    if (!orderId) { setLoadingOrder(false); return; }
    orderService.getOrder(orderId)
      .then(({ data }) => setOrder(data))
      .catch(() => {})
      .finally(() => setLoadingOrder(false));
  }, [orderId]);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 pt-32 pb-20 text-center">

        {/* Success checkmark — shows immediately */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
          style={{ background: "rgba(74,222,128,0.12)" }}
        >
          <CheckCircle size={48} style={{ color: "#4ade80" }} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1 className="text-3xl font-normal mb-3"
            style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
            Order Placed Successfully!
          </h1>
          <p className="mb-8" style={{ color: "var(--cream-dim)" }}>
            Thank you for shopping with Thread Tales by Teju 🌸
          </p>

          {/* Order details — skeleton while loading */}
          <div className="p-6 text-left mb-8"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>

            {loadingOrder ? (
              /* Skeleton */
              <div className="space-y-3">
                <div className="h-4 w-32 rounded animate-pulse" style={{ background: "var(--border)" }} />
                <div className="flex gap-3 mt-4">
                  <div className="w-12 h-12 rounded animate-pulse flex-shrink-0" style={{ background: "var(--border)" }} />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-3/4 rounded animate-pulse" style={{ background: "var(--border)" }} />
                    <div className="h-3 w-1/3 rounded animate-pulse" style={{ background: "var(--border)" }} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded animate-pulse flex-shrink-0" style={{ background: "var(--border)" }} />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-2/3 rounded animate-pulse" style={{ background: "var(--border)" }} />
                    <div className="h-3 w-1/4 rounded animate-pulse" style={{ background: "var(--border)" }} />
                  </div>
                </div>
              </div>
            ) : order ? (
              <>
                <h3 className="font-normal text-base mb-1"
                  style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
                  Order Details
                </h3>
                <p className="text-sm mb-4" style={{ color: "var(--gold)" }}>#{order.order_number}</p>

                <div className="space-y-3">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      {item.product_image && (
                        <img src={item.product_image} alt=""
                          className="w-12 h-12 object-cover flex-shrink-0"
                          style={{ border: "1px solid var(--border)" }} />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: "var(--cream)" }}>
                          {item.product_name}
                        </p>
                        <p className="text-xs" style={{ color: "var(--cream-dim)" }}>
                          ×{item.quantity} · ₹{item.total_price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between font-medium pt-4 mt-3"
                  style={{ borderTop: "1px solid var(--border)", color: "var(--cream)" }}>
                  <span>Total Paid</span>
                  <span style={{ color: "var(--gold)" }}>₹{order.total_amount?.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-2 text-sm mt-3">
                  <Package size={14} style={{ color: "var(--gold)" }} />
                  <span style={{ color: "var(--cream-dim)" }}>Status:</span>
                  <span className="capitalize font-medium" style={{ color: "var(--cream)" }}>
                    {order.status}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-center py-2" style={{ color: "var(--cream-dim)" }}>
                Order confirmed! Check your email for details.
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/orders" className="btn-gold px-6 py-3.5 flex items-center justify-center gap-2">
              <Package size={18} /> Track My Orders
            </Link>
            <a
              href={`https://wa.me/919866052260?text=${encodeURIComponent("Hi! I just placed an order and want to confirm.")}`}
              target="_blank" rel="noreferrer"
              className="px-6 py-3.5 flex items-center justify-center gap-2 font-medium text-sm tracking-widest uppercase transition-all"
              style={{ border: "1px solid #4ade80", color: "#4ade80" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#4ade80"; e.currentTarget.style.color = "var(--bg)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#4ade80"; }}>
              <MessageCircle size={18} /> WhatsApp Us
            </a>
            <Link to="/shop" className="btn-outline px-6 py-3.5 flex items-center justify-center gap-2">
              <ArrowRight size={18} /> Shop More
            </Link>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
