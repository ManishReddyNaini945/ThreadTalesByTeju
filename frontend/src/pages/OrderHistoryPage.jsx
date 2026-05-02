import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Package, ChevronRight, ChevronLeft, Clock, Truck, CheckCircle, XCircle, MapPin, CreditCard, Ban, Download } from "lucide-react";
import { orderService } from "../services/orderService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const statusConfig = {
  pending:    { icon: Clock,        color: "#c8a45c", label: "Pending" },
  confirmed:  { icon: CheckCircle,  color: "#60a5fa", label: "Confirmed" },
  processing: { icon: Package,      color: "#c084fc", label: "Processing" },
  shipped:    { icon: Truck,        color: "#fb923c", label: "Shipped" },
  delivered:  { icon: CheckCircle,  color: "#4ade80", label: "Delivered" },
  cancelled:  { icon: XCircle,      color: "#f87171", label: "Cancelled" },
};

function OrderCard({ order }) {
  const cfg = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = cfg.icon;
  const date = new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="p-5 transition-colors"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-medium" style={{ color: "var(--cream)" }}>#{order.order_number}</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--cream-dim)" }}>{date}</p>
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium tracking-wide"
          style={{ color: cfg.color, border: `1px solid ${cfg.color}`, background: `${cfg.color}15` }}>
          <StatusIcon size={12} /> {cfg.label}
        </span>
      </div>

      <div className="flex gap-2 mb-4 overflow-hidden">
        {order.items?.slice(0, 4).map((item) => (
          <div key={item.id} className="relative">
            {item.product_image && (
              <img src={item.product_image} alt="" className="w-12 h-12 object-cover" style={{ border: "1px solid var(--border)" }} />
            )}
            {item.quantity > 1 && (
              <span className="absolute -top-1 -right-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: "var(--gold)", color: "var(--bg)" }}>
                {item.quantity}
              </span>
            )}
          </div>
        ))}
        {order.items?.length > 4 && (
          <div className="w-12 h-12 flex items-center justify-center text-xs"
            style={{ border: "1px solid var(--border)", color: "var(--cream-dim)" }}>
            +{order.items.length - 4}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs" style={{ color: "var(--cream-dim)" }}>{order.items?.length} item{order.items?.length !== 1 ? "s" : ""}</p>
          <p className="font-medium" style={{ color: "var(--cream)" }}>₹{order.total_amount?.toLocaleString()}</p>
        </div>
        <Link to={`/order/${order.id}`}
          className="flex items-center gap-1 text-sm font-medium transition-colors"
          style={{ color: "var(--gold)" }}>
          View Details <ChevronRight size={14} />
        </Link>
      </div>

      {order.tracking_number && (
        <div className="mt-3 pt-3 flex items-center gap-1 text-xs" style={{ borderTop: "1px solid var(--border)", color: "var(--cream-dim)" }}>
          <Truck size={12} /> Tracking: <span className="font-medium" style={{ color: "var(--cream)" }}>{order.tracking_number}</span>
        </div>
      )}
    </motion.div>
  );
}

function OrderDetailView({ orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    orderService.getOrder(orderId).then(({ data }) => setOrder(data)).catch(() => {}).finally(() => setLoading(false));
  }, [orderId]);

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(true);
    try {
      await orderService.cancelOrder(order.id);
      setOrder((prev) => ({ ...prev, status: "cancelled" }));
      toast.success("Order cancelled successfully");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  const cfg = order ? (statusConfig[order.status] || statusConfig.pending) : null;
  const StatusIcon = cfg?.icon;
  const canCancel = order && ["pending", "confirmed"].includes(order.status);

  const downloadInvoice = () => {
    const addr = order.shipping_address || {};
    const date = new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
    const itemsRows = order.items?.map(i => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee">${i.product_name}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">₹${i.unit_price.toLocaleString()}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">₹${i.total_price.toLocaleString()}</td>
      </tr>`).join("");

    const html = `<!DOCTYPE html><html><head><title>Invoice #${order.order_number}</title>
      <style>body{font-family:Arial,sans-serif;max-width:700px;margin:40px auto;color:#1a1614}
      h1{color:#c8a45c;font-family:Georgia,serif}table{width:100%;border-collapse:collapse}
      th{text-align:left;padding-bottom:8px;border-bottom:2px solid #c8a45c;font-size:13px}
      .total{font-size:16px;font-weight:bold}@media print{button{display:none}}</style></head>
      <body>
        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:32px">
          <div><h1 style="margin:0">Thread Tales by Teju</h1>
            <p style="margin:4px 0;color:#666;font-size:13px">Hyderabad, Telangana, India</p>
            <p style="margin:2px 0;color:#666;font-size:13px">tejureddy6060@gmail.com | +91 98660 52260</p>
          </div>
          <div style="text-align:right">
            <p style="font-size:20px;font-weight:bold;margin:0">INVOICE</p>
            <p style="color:#c8a45c;font-size:16px;margin:4px 0">#${order.order_number}</p>
            <p style="color:#666;font-size:13px;margin:0">${date}</p>
          </div>
        </div>
        <div style="margin-bottom:24px;padding:16px;background:#f9f9f9;border-left:4px solid #c8a45c">
          <p style="margin:0;font-weight:bold">${addr.full_name || ""}</p>
          <p style="margin:4px 0 0;color:#555;font-size:13px">${addr.address_line1 || ""}${addr.address_line2 ? ", " + addr.address_line2 : ""}</p>
          <p style="margin:2px 0 0;color:#555;font-size:13px">${addr.city || ""}, ${addr.state || ""} – ${addr.pincode || ""}</p>
          <p style="margin:2px 0 0;color:#555;font-size:13px">${addr.phone || ""}</p>
        </div>
        <table><thead><tr>
          <th>Item</th><th style="text-align:center">Qty</th>
          <th style="text-align:right">Unit Price</th><th style="text-align:right">Total</th>
        </tr></thead><tbody>${itemsRows}</tbody></table>
        <div style="text-align:right;margin-top:16px;border-top:2px solid #eee;padding-top:12px">
          <p style="color:#555;margin:4px 0;font-size:13px">Subtotal: ₹${order.subtotal?.toLocaleString()}</p>
          ${order.discount_amount > 0 ? `<p style="color:#16a34a;margin:4px 0;font-size:13px">Discount: -₹${order.discount_amount?.toLocaleString()}</p>` : ""}
          <p style="color:#555;margin:4px 0;font-size:13px">Shipping: ${order.shipping_amount === 0 ? "FREE" : "₹" + order.shipping_amount}</p>
          <p class="total" style="margin:8px 0 0;color:#1a1614">Total Paid: ₹${order.total_amount?.toLocaleString()}</p>
        </div>
        <p style="margin-top:32px;font-size:12px;color:#aaa;text-align:center">Thank you for shopping with Thread Tales by Teju ♥</p>
        <button onclick="window.print()" style="margin-top:16px;padding:10px 24px;background:#c8a45c;color:#fff;border:none;cursor:pointer;font-size:14px">
          Print / Save as PDF
        </button>
      </body></html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 lg:px-10 pt-32 pb-20">
        <Link to="/orders" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
          style={{ color: "var(--cream-dim)" }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--cream-dim)"}>
          <ChevronLeft size={16} /> Back to Orders
        </Link>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }} />
          </div>
        ) : !order ? (
          <p style={{ color: "var(--cream-dim)" }}>Order not found.</p>
        ) : (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-normal" style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
                  Order #{order.order_number}
                </h1>
                <p className="text-sm mt-1" style={{ color: "var(--cream-dim)" }}>
                  {new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium"
                  style={{ color: cfg.color, border: `1px solid ${cfg.color}`, background: `${cfg.color}15` }}>
                  <StatusIcon size={14} /> {cfg.label}
                </span>
                <button onClick={downloadInvoice}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all"
                  style={{ border: "1px solid var(--border)", color: "var(--cream-dim)" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--cream-dim)"; }}>
                  <Download size={14} /> Invoice
                </button>
                {canCancel && (
                  <button onClick={handleCancel} disabled={cancelling}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all disabled:opacity-50"
                    style={{ border: "1px solid #f87171", color: "#f87171" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.1)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <Ban size={14} /> {cancelling ? "Cancelling..." : "Cancel Order"}
                  </button>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="p-6 space-y-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <h2 className="font-normal text-base mb-4 pb-3" style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)", borderBottom: "1px solid var(--border)" }}>
                Items Ordered
              </h2>
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  {item.product_image && (
                    <img src={item.product_image} alt="" className="w-16 h-16 object-cover flex-shrink-0"
                      style={{ border: "1px solid var(--border)" }} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium" style={{ color: "var(--cream)" }}>{item.product_name}</p>
                    <p className="text-sm mt-0.5" style={{ color: "var(--cream-dim)" }}>Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium" style={{ color: "var(--cream)" }}>₹{item.total_price?.toLocaleString()}</p>
                </div>
              ))}

              {/* Totals */}
              <div className="space-y-2 pt-4 text-sm" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="flex justify-between">
                  <span style={{ color: "var(--cream-dim)" }}>Subtotal</span>
                  <span style={{ color: "var(--cream)" }}>₹{order.subtotal_amount?.toLocaleString()}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span><span>-₹{order.discount_amount?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span style={{ color: "var(--cream-dim)" }}>Shipping</span>
                  <span style={{ color: order.shipping_amount === 0 ? "#4ade80" : "var(--cream)" }}>
                    {order.shipping_amount === 0 ? "FREE" : `₹${order.shipping_amount}`}
                  </span>
                </div>
                <div className="flex justify-between font-medium text-base pt-2"
                  style={{ borderTop: "1px solid var(--border)", color: "var(--cream)" }}>
                  <span>Total Paid</span><span>₹{order.total_amount?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {order.shipping_address && (
              <div className="p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <h2 className="font-normal text-base mb-4 flex items-center gap-2"
                  style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
                  <MapPin size={16} style={{ color: "var(--gold)" }} /> Shipping Address
                </h2>
                <div className="text-sm space-y-1" style={{ color: "var(--cream-dim)" }}>
                  <p style={{ color: "var(--cream)" }}>{order.shipping_address.full_name}</p>
                  <p>{order.shipping_address.address_line1}</p>
                  {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
                  <p>{order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}</p>
                  <p>{order.shipping_address.phone}</p>
                </div>
              </div>
            )}

            {/* Payment & Tracking */}
            <div className="p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <h2 className="font-normal text-base mb-4 flex items-center gap-2"
                style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
                <CreditCard size={16} style={{ color: "var(--gold)" }} /> Payment Info
              </h2>
              <div className="text-sm space-y-2" style={{ color: "var(--cream-dim)" }}>
                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span style={{ color: "var(--cream)" }} className="capitalize">{order.payment_method || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status</span>
                  <span style={{ color: order.payment_status === "paid" ? "#4ade80" : "var(--cream)" }} className="capitalize">
                    {order.payment_status || "—"}
                  </span>
                </div>
                {order.tracking_number && (
                  <div className="flex justify-between">
                    <span>Tracking Number</span>
                    <span style={{ color: "var(--cream)" }}>{order.tracking_number}</span>
                  </div>
                )}
              </div>
            </div>

          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function OrderHistoryPage() {
  const { orderId } = useParams();

  if (orderId) return <OrderDetailView orderId={orderId} />;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getOrders().then(({ data }) => setOrders(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 lg:px-10 pt-32 pb-20">
        <div className="flex items-center gap-3 mb-10">
          <Package size={24} style={{ color: "var(--gold)" }} />
          <h1 className="text-3xl font-normal" style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
            My Orders
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }} />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24">
            <Package size={64} className="mx-auto mb-6" style={{ color: "var(--border)" }} />
            <h2 className="text-xl font-normal mb-3" style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
              No orders yet
            </h2>
            <p className="mb-8" style={{ color: "var(--cream-dim)" }}>Your order history will appear here</p>
            <Link to="/shop" className="btn-gold inline-flex items-center gap-2">
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
