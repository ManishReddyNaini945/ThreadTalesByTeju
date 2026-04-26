import { useEffect, useState, useCallback } from "react";
import { adminService } from "../../services/adminService";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const orderStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    adminService.getOrders({ page, page_size: 20, status: filterStatus || undefined })
      .then(({ data }) => { setOrders(data.items); setTotal(data.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, filterStatus]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      toast.success("Order status updated");
      fetchOrders();
    } catch { toast.error("Failed to update status"); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Orders <span className="text-gray-400 text-lg font-normal">({total})</span></h1>
        <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-gold/40">
          <option value="">All Statuses</option>
          {orderStatuses.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Order #", "Customer", "Items", "Total", "Payment", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={8} className="px-4 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
                ))
              ) : orders.map((order) => (
                <>
                  <tr key={order.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                    <td className="px-4 py-3 font-medium text-gray-800 text-xs">{order.order_number}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{order.shipping_address?.full_name}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{order.items?.length}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800 text-xs">₹{order.total_amount?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.payment_status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </td>
                    <td className="px-4 py-3">
                      <select value={order.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-gold/40">
                        {orderStatuses.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                      </select>
                    </td>
                  </tr>
                  {expandedOrder === order.id && (
                    <tr key={`${order.id}-expand`}>
                      <td colSpan={8} className="px-4 py-4 bg-gray-50">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-2">Items</p>
                            {order.items?.map((item) => (
                              <div key={item.id} className="flex items-center gap-2 mb-1.5">
                                {item.product_image && <img src={item.product_image} alt="" className="w-8 h-8 rounded-lg object-cover" />}
                                <div>
                                  <p className="text-xs font-medium text-gray-800">{item.product_name}</p>
                                  <p className="text-xs text-gray-400">×{item.quantity} · ₹{item.total_price.toLocaleString()}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-2">Shipping Address</p>
                            <div className="text-xs text-gray-600 space-y-0.5">
                              <p className="font-medium">{order.shipping_address?.full_name}</p>
                              <p>{order.shipping_address?.phone}</p>
                              <p>{order.shipping_address?.address_line1}</p>
                              {order.shipping_address?.address_line2 && <p>{order.shipping_address.address_line2}</p>}
                              <p>{order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.pincode}</p>
                            </div>
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
      </div>
    </div>
  );
}
