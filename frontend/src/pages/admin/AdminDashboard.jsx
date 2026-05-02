import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import { ShoppingBag, Package, Users, IndianRupee, TrendingUp, Award, Clock } from "lucide-react";
import { adminService } from "../../services/adminService";

const gold = "#c8a45c";
const cream = "#f7f5f2";
const creamDim = "#a89f94";
const cardBg = "#1c1916";
const border = "#2d2824";
const bg2 = "#141210";

const STATUS_COLORS = {
  pending: "#c8a45c",
  confirmed: "#60a5fa",
  processing: "#c084fc",
  shipped: "#fb923c",
  delivered: "#4ade80",
  cancelled: "#f87171",
};

function StatCard({ label, value, icon: Icon, accent, prefix = "", delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="p-5 flex items-center gap-4"
      style={{ background: cardBg, border: `1px solid ${border}`, borderLeft: `3px solid ${accent}` }}>
      <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: `${accent}18`, border: `1px solid ${accent}40` }}>
        <Icon size={20} style={{ color: accent }} />
      </div>
      <div>
        <p className="text-xs tracking-widest uppercase mb-1" style={{ color: creamDim }}>{label}</p>
        <p className="text-2xl font-bold" style={{ fontFamily: "Playfair Display, serif", color: cream }}>
          {prefix}{typeof value === "number" ? value.toLocaleString() : (value ?? "—")}
        </p>
      </div>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 text-xs" style={{ background: "#0f0d0c", border: `1px solid ${border}`, color: cream }}>
      <p style={{ color: creamDim }} className="mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name === "revenue" ? `₹${Number(p.value).toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard().then(({ data }) => setData(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: gold, borderTopColor: "transparent" }} />
      </div>
    );
  }

  const revenueData = data?.revenue_series?.map(d => ({
    date: d.date.slice(5),
    revenue: d.revenue,
    orders: d.orders,
  })) || [];

  const statusData = Object.entries(data?.orders_by_status || {}).map(([name, value]) => ({ name, value }));

  const maxQty = Math.max(...(data?.top_products || []).map(p => p.qty), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-normal" style={{ fontFamily: "Playfair Display, serif", color: cream }}>Dashboard</h1>
        <p className="text-xs" style={{ color: creamDim }}>{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={data?.stats.total_revenue} icon={IndianRupee} accent={gold} prefix="₹" delay={0} />
        <StatCard label="Total Orders" value={data?.stats.total_orders} icon={ShoppingBag} accent="#60a5fa" delay={0.05} />
        <StatCard label="Total Products" value={data?.stats.total_products} icon={Package} accent="#c084fc" delay={0.1} />
        <StatCard label="Total Users" value={data?.stats.total_users} icon={Users} accent="#4ade80" delay={0.15} />
      </div>

      {/* Revenue Chart */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="p-6" style={{ background: cardBg, border: `1px solid ${border}` }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-normal text-base" style={{ fontFamily: "Playfair Display, serif", color: cream }}>Revenue Trend</h2>
            <p className="text-xs mt-0.5" style={{ color: creamDim }}>Last 30 days</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold" style={{ color: gold }}>
              ₹{(data?.revenue_series?.reduce((a, d) => a + d.revenue, 0) || 0).toLocaleString()}
            </p>
            <p className="text-xs" style={{ color: creamDim }}>total revenue</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gold} stopOpacity={0.25} />
                <stop offset="95%" stopColor={gold} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={border} vertical={false} />
            <XAxis dataKey="date" tick={{ fill: creamDim, fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
            <YAxis tick={{ fill: creamDim, fontSize: 10 }} axisLine={false} tickLine={false}
              tickFormatter={v => v >= 1000 ? `₹${(v/1000).toFixed(0)}k` : `₹${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" name="revenue" stroke={gold} strokeWidth={2}
              fill="url(#revenueGrad)" dot={false} activeDot={{ r: 4, fill: gold }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Bottom row: Order Status Pie + Top Products */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Orders by Status */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="p-6" style={{ background: cardBg, border: `1px solid ${border}` }}>
          <h2 className="font-normal text-base mb-5" style={{ fontFamily: "Playfair Display, serif", color: cream }}>Orders by Status</h2>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="40%" cy="50%" outerRadius={80}
                  innerRadius={48} paddingAngle={3}>
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || gold} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  layout="vertical" align="right" verticalAlign="middle"
                  formatter={(value) => <span style={{ color: creamDim, fontSize: 11, textTransform: "capitalize" }}>{value}</span>}
                  iconType="circle" iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40" style={{ color: creamDim }}>No orders yet</div>
          )}
        </motion.div>

        {/* Top Products */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="p-6" style={{ background: cardBg, border: `1px solid ${border}` }}>
          <h2 className="font-normal text-base mb-5 flex items-center gap-2" style={{ fontFamily: "Playfair Display, serif", color: cream }}>
            <Award size={16} style={{ color: gold }} /> Top Selling Products
          </h2>
          {data?.top_products?.length ? (
            <div className="space-y-4">
              {data.top_products.map((p, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="truncate max-w-[55%] font-medium" style={{ color: cream }}>{p.name}</span>
                    <span style={{ color: creamDim }}>{p.qty} sold · ₹{p.revenue.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: border }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${(p.qty / maxQty) * 100}%`, background: gold }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40" style={{ color: creamDim }}>No sales data yet</div>
          )}
        </motion.div>
      </div>

      {/* Orders bar chart */}
      {revenueData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="p-6" style={{ background: cardBg, border: `1px solid ${border}` }}>
          <h2 className="font-normal text-base mb-5" style={{ fontFamily: "Playfair Display, serif", color: cream }}>Daily Order Volume</h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={border} vertical={false} />
              <XAxis dataKey="date" tick={{ fill: creamDim, fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fill: creamDim, fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="orders" name="orders" fill={gold} fillOpacity={0.8} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Recent Orders */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        style={{ background: cardBg, border: `1px solid ${border}` }}>
        <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: `1px solid ${border}` }}>
          <Clock size={15} style={{ color: gold }} />
          <h2 className="font-normal text-base" style={{ fontFamily: "Playfair Display, serif", color: cream }}>Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {["Order #", "Customer", "Amount", "Status", "Date"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs tracking-widest uppercase" style={{ color: creamDim }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.recent_orders?.map((order) => (
                <tr key={order.id} style={{ borderBottom: `1px solid ${border}` }}
                  onMouseEnter={e => e.currentTarget.style.background = "#231f1b"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td className="px-5 py-3 font-medium" style={{ color: gold }}>{order.order_number}</td>
                  <td className="px-5 py-3" style={{ color: cream }}>{order.customer}</td>
                  <td className="px-5 py-3 font-semibold" style={{ color: cream }}>₹{order.total.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className="px-2.5 py-1 text-xs font-medium capitalize"
                      style={{ color: STATUS_COLORS[order.status] || cream, background: `${STATUS_COLORS[order.status] || cream}15`, border: `1px solid ${STATUS_COLORS[order.status] || cream}40` }}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: creamDim }}>
                    {new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
