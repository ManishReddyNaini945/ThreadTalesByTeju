import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Package, MessageCircle, Home } from "lucide-react";
import { orderService } from "../services/orderService";
import Navbar from "../components/Navbar";

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      orderService.getOrder(orderId).then(({ data }) => setOrder(data)).catch(() => {});
    }
  }, [orderId]);

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle size={48} className="text-green-500" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="text-3xl font-serif text-brand-dark mb-3">Order Placed Successfully!</h1>
          <p className="text-brand-dark/60 mb-2">Thank you for shopping with Thread Tales by Teju 🌸</p>
          {order && (
            <p className="text-brand-gold font-medium text-lg mb-8">Order #{order.order_number}</p>
          )}

          {order && (
            <div className="bg-white rounded-3xl p-6 shadow-sm text-left mb-8 space-y-3">
              <h3 className="font-semibold text-brand-dark mb-4">Order Details</h3>
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  {item.product_image && (
                    <img src={item.product_image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-brand-dark">{item.product_name}</p>
                    <p className="text-xs text-brand-dark/50">×{item.quantity} · ₹{item.total_price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
              <div className="border-t border-brand-dark/10 pt-3 flex justify-between font-bold text-brand-dark">
                <span>Total Paid</span>
                <span>₹{order.total_amount?.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Package size={14} className="text-brand-gold" />
                <span className="text-brand-dark/60">Status:</span>
                <span className="capitalize font-medium text-brand-dark">{order.status}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/orders"
              className="px-6 py-3.5 bg-brand-dark text-brand-cream rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-brand-gold transition-colors">
              <Package size={18} /> Track My Orders
            </Link>
            <a href={`https://wa.me/919866052260?text=${encodeURIComponent("Hi! I just placed an order and want to track it.")}`}
              target="_blank" rel="noreferrer"
              className="px-6 py-3.5 border-2 border-green-400 text-green-600 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-green-50 transition-colors">
              <MessageCircle size={18} /> WhatsApp Support
            </a>
            <Link to="/"
              className="px-6 py-3.5 border-2 border-brand-dark/20 text-brand-dark rounded-2xl font-medium flex items-center justify-center gap-2 hover:border-brand-gold hover:text-brand-gold transition-colors">
              <Home size={18} /> Continue Shopping
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
