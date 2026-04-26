import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Package, Users, IndianRupee, TrendingUp } from "lucide-react";
import { adminService } from "../../services/adminService";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function StatCard({ label, value, icon: Icon, color, prefix }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-gray-500 text-xs font-medium">{label}</p>
        <p className="text-xl font-bold text-gray-800 mt-0.5">{prefix}{typeof value === "number" ? value.toLocaleString() : value}</p>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard().then(({ data }) => setData(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={data?.stats.total_revenue} icon={IndianRupee} color="bg-brand-gold" prefix="₹" />
        <StatCard label="Total Orders" value={data?.stats.total_orders} icon={ShoppingBag} color="bg-blue-500" />
        <StatCard label="Total Products" value={data?.stats.total_products} icon={Package} color="bg-purple-500" />
        <StatCard label="Total Users" value={data?.stats.total_users} icon={Users} color="bg-green-500" />
      </div>

      {/* Orders by status */}
      {data?.orders_by_status && (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-brand-gold" /> Orders by Status</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(data.orders_by_status).map(([status, count]) => (
              <span key={status} className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${statusColors[status] || "bg-gray-100 text-gray-600"}`}>
                {status}: {count}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent orders */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Order #", "Customer", "Amount", "Status", "Date"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.recent_orders?.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{order.order_number}</td>
                  <td className="px-5 py-3 text-gray-600">{order.customer}</td>
                  <td className="px-5 py-3 font-semibold text-gray-800">₹{order.total.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
