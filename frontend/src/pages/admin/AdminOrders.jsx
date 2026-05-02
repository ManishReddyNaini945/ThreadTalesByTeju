import { useEffect, useState, useCallback } from "react";
import { adminService } from "../../services/adminService";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, MessageCircle, Truck, Filter } from "lucide-react";

const gold = "#c8a45c";
const cream = "#f7f5f2";
const creamDim = "#a89f94";
const cardBg = "#1c1916";
const border = "#2d2824";

const STATUS_CFG = {
  pending:    { color: "#c8a45c", label: "Pending" },
  confirmed:  { color: "#60a5fa", label: "Confirmed" },
  processing: { color: "#c084fc", label: "Processing" },
  shipped:    { color: "#fb923c", label: "Shipped" },
  delivered:  { color: "#4ade80", label: "Delivered" },
  cancelled:  { color: "#f87171", label: "Cancelled" },
};

const orderStatuses = Object.keys(STATUS_CFG);

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || { color: cream, label: status };
  return (
    <span className="px-2.5 py-1 text-xs font-medium capitalize"
      style={{ color: cfg.color, background: `${cfg.color}15`, border: `1px solid ${cfg.color}40` }}>
      {cfg.label}
    </span>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [trackingInputs, setTrackingInputs] = useState({});

  const fetchOrders = useCallback(() => {
    setLoading(true);
    adminService.getOrders({ page, page_size: 20, status: filterStatus || undefined })
      .then(({ data }) => { setOrders(data.items); setTotal(data.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, filterStatus]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (orderId, newStatus, tracking) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus, tracking);
      toast.success("Status updated");
      fetchOrders();
    } catch { toast.error("Failed to update"); }
  };

  const sendWhatsApp = (order, customMsg) => {
    const phone = order.shipping_address?.phone?.replace(/\D/g, "").slice(-10);
    if (!phone) { toast.error("No phone number"); return; }
    const msg = customMsg || `Hi ${order.shipping_address?.full_name}, your Thread Tales by Teju order *#${order.order_number}* status: *${order.status.toUpperCase()}*. Thank you! 🌸`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const inputStyle = {
    background: "#0f0d0c", border: `1px solid ${border}`, color: cream,
    fontSize: 12, padding: "6px 10px", outline: "none",
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-normal" style={{ fontFamily: "Playfair Display, serif", color: cream }}>Orders</h1>
          <p className="text-xs mt-0.5" style={{ color: creamDim }}>{total} total orders</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} style={{ color: creamDim }} />
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="text-xs px-3 py-2 focus:outline-none"
            style={{ ...inputStyle, paddingRight: 28 }}>
            <option value="">All Statuses</option>
            {orderStatuses.map(s => <option key={s} value={s} className="capitalize">{STATUS_CFG[s].label}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: cardBg, border: `1px solid ${border}` }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {["Order #", "Customer", "Items", "Total", "Payment", "Status", "Date", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs tracking-widest uppercase" style={{ color: creamDim }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${border}` }}>
                    <td colSpan={8} className="px-4 py-4">
                      <div className="h-3 rounded animate-pulse" style={{ background: border }} />
                    </td>
                  </tr>
                ))
              ) : orders.map((order) => (
                <>
                  <tr key={order.id} className="cursor-pointer transition-colors"
                    style={{ borderBottom: `1px solid ${border}` }}
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    onMouseEnter={e => e.currentTarget.style.background = "#231f1b"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td className="px-4 py-3 font-medium text-xs" style={{ color: gold }}>{order.order_number}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: cream }}>{order.shipping_address?.full_name}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: creamDim }}>{order.items?.length}</td>
                    <td className="px-4 py-3 font-semibold text-xs" style={{ color: cream }}>₹{order.total_amount?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5"
                        style={{ color: order.payment_status === "paid" ? "#4ade80" : "#c8a45c", background: order.payment_status === "paid" ? "#4ade8015" : "#c8a45c15", border: `1px solid ${order.payment_status === "paid" ? "#4ade8040" : "#c8a45c40"}` }}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                    <td className="px-4 py-3 text-xs" style={{ color: creamDim }}>
                      {new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select value={order.status} onClick={e => e.stopPropagation()}
                          onChange={e => updateStatus(order.id, e.target.value, trackingInputs[order.id])}
                          className="text-xs px-2 py-1.5 focus:outline-none"
                          style={inputStyle}>
                          {orderStatuses.map(s => <option key={s} value={s}>{STATUS_CFG[s].label}</option>)}
                        </select>
                        <button onClick={e => { e.stopPropagation(); sendWhatsApp(order); }}
                          className="p-1.5 transition-colors" title="WhatsApp customer"
                          style={{ color: "#4ade80" }}>
                          <MessageCircle size={14} />
                        </button>
                        {expandedOrder === order.id ? <ChevronUp size={14} style={{ color: creamDim }} /> : <ChevronDown size={14} style={{ color: creamDim }} />}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Row */}
                  {expandedOrder === order.id && (
                    <tr key={`${order.id}-exp`} style={{ borderBottom: `1px solid ${border}` }}>
                      <td colSpan={8} className="px-4 py-5" style={{ background: "#141210" }}>
                        <div className="grid sm:grid-cols-3 gap-6">
                          {/* Items */}
                          <div>
                            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: creamDim }}>Items Ordered</p>
                            <div className="space-y-2">
                              {order.items?.map(item => (
                                <div key={item.id} className="flex items-center gap-2">
                                  {item.product_image && (
                                    <img src={item.product_image} alt="" className="w-9 h-9 object-cover flex-shrink-0"
                                      style={{ border: `1px solid ${border}` }} />
                                  )}
                                  <div>
                                    <p className="text-xs font-medium" style={{ color: cream }}>{item.product_name}</p>
                                    <p className="text-xs" style={{ color: creamDim }}>×{item.quantity} · ₹{item.total_price.toLocaleString()}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Address */}
                          <div>
                            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: creamDim }}>Shipping Address</p>
                            <div className="text-xs space-y-1" style={{ color: creamDim }}>
                              <p className="font-medium" style={{ color: cream }}>{order.shipping_address?.full_name}</p>
                              <p>{order.shipping_address?.phone}</p>
                              <p>{order.shipping_address?.address_line1}</p>
                              {order.shipping_address?.address_line2 && <p>{order.shipping_address.address_line2}</p>}
                              <p>{order.shipping_address?.city}, {order.shipping_address?.state} – {order.shipping_address?.pincode}</p>
                            </div>
                          </div>

                          {/* Tracking + WhatsApp */}
                          <div>
                            <p className="text-xs tracking-widest uppercase mb-3 flex items-center gap-1" style={{ color: creamDim }}>
                              <Truck size={11} /> Tracking
                            </p>
                            <div className="flex gap-2 mb-3">
                              <input defaultValue={order.tracking_number || ""}
                                onChange={e => setTrackingInputs(p => ({ ...p, [order.id]: e.target.value }))}
                                placeholder="Enter tracking number"
                                className="flex-1 focus:outline-none text-xs"
                                style={inputStyle}
                                onClick={e => e.stopPropagation()} />
                              <button onClick={e => { e.stopPropagation(); updateStatus(order.id, order.status, trackingInputs[order.id]); }}
                                className="px-3 py-1.5 text-xs transition-colors"
                                style={{ background: `${gold}20`, color: gold, border: `1px solid ${gold}40` }}>
                                Save
                              </button>
                            </div>
                            <button onClick={e => { e.stopPropagation(); sendWhatsApp(order); }}
                              className="flex items-center gap-1.5 text-xs transition-colors"
                              style={{ color: "#4ade80" }}>
                              <MessageCircle size={13} /> Send WhatsApp Update
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 20 && (
          <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: `1px solid ${border}` }}>
            <p className="text-xs" style={{ color: creamDim }}>Page {page} of {Math.ceil(total / 20)}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 text-xs transition-colors disabled:opacity-40"
                style={{ border: `1px solid ${border}`, color: creamDim }}>Prev</button>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 20)}
                className="px-3 py-1.5 text-xs transition-colors disabled:opacity-40"
                style={{ border: `1px solid ${border}`, color: creamDim }}>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
