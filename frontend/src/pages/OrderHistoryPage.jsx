import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, ChevronRight, Clock, Truck, CheckCircle, XCircle } from "lucide-react";
import { orderService } from "../services/orderService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const statusConfig = {
  pending: { icon: Clock, color: "text-yellow-500 bg-yellow-50", label: "Pending" },
  confirmed: { icon: CheckCircle, color: "text-blue-500 bg-blue-50", label: "Confirmed" },
  processing: { icon: Package, color: "text-purple-500 bg-purple-50", label: "Processing" },
  shipped: { icon: Truck, color: "text-orange-500 bg-orange-50", label: "Shipped" },
  delivered: { icon: CheckCircle, color: "text-green-500 bg-green-50", label: "Delivered" },
  cancelled: { icon: XCircle, color: "text-red-500 bg-red-50", label: "Cancelled" },
};

function OrderCard({ order }) {
  const cfg = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = cfg.icon;
  const date = new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-bold text-brand-dark">#{order.order_number}</p>
          <p className="text-xs text-brand-dark/40 mt-0.5">{date}</p>
        </div>
        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${cfg.color}`}>
          <StatusIcon size={12} /> {cfg.label}
        </span>
      </div>

      {/* Items preview */}
      <div className="flex gap-2 mb-4 overflow-hidden">
        {order.items?.slice(0, 4).map((item) => (
          <div key={item.id} className="relative">
            {item.product_image && (
              <img src={item.product_image} alt="" className="w-12 h-12 rounded-xl object-cover" />
            )}
            {item.quantity > 1 && (
              <span className="absolute -top-1 -right-1 bg-brand-dark text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
            )}
          </div>
        ))}
        {order.items?.length > 4 && (
          <div className="w-12 h-12 rounded-xl bg-brand-dark/5 flex items-center justify-center text-xs text-brand-dark/50">
            +{order.items.length - 4}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-brand-dark/40">{order.items?.length} item{order.items?.length !== 1 ? "s" : ""}</p>
          <p className="font-bold text-brand-dark">₹{order.total_amount?.toLocaleString()}</p>
        </div>
        <Link to={`/order/${order.id}`}
          className="flex items-center gap-1 text-sm text-brand-gold hover:underline font-medium">
          View Details <ChevronRight size={14} />
        </Link>
      </div>

      {order.tracking_number && (
        <div className="mt-3 pt-3 border-t border-brand-dark/5">
          <p className="text-xs text-brand-dark/50 flex items-center gap-1">
            <Truck size={12} /> Tracking: <span className="font-medium text-brand-dark">{order.tracking_number}</span>
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getOrders().then(({ data }) => setOrders(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-serif text-brand-dark mb-8 flex items-center gap-3">
          <Package size={28} className="text-brand-gold" /> My Orders
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24">
            <Package size={64} className="text-brand-dark/20 mx-auto mb-6" />
            <h2 className="text-xl font-serif text-brand-dark mb-3">No orders yet</h2>
            <p className="text-brand-dark/50 mb-8">Your order history will appear here</p>
            <Link to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-dark text-brand-cream rounded-2xl font-medium hover:bg-brand-gold transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {orders.map((order) => <OrderCard key={order.id} order={order} />)}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
