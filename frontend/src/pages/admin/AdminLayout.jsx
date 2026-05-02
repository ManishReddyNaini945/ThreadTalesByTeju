import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, Tags, LogOut, Menu, X, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/categories", label: "Categories", icon: Tags },
];

const bg = "#0c0a09";
const card = "#1c1916";
const border = "#2d2824";
const gold = "#c8a45c";
const cream = "#f7f5f2";
const creamDim = "#a89f94";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate("/"); };

  const pageTitle = navItems.find(n => n.end ? location.pathname === n.to : location.pathname.startsWith(n.to))?.label || "Admin";

  return (
    <div className="min-h-screen flex" style={{ background: bg }}>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "#0f0d0c", borderRight: `1px solid ${border}` }}>

        {/* Logo */}
        <div className="px-6 py-5" style={{ borderBottom: `1px solid ${border}` }}>
          <p className="text-lg font-normal" style={{ fontFamily: "Playfair Display, serif", color: gold }}>Thread Tales</p>
          <p className="text-[10px] tracking-[3px] uppercase mt-0.5" style={{ color: creamDim }}>Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 ${isActive ? "" : "hover:bg-white/5"}`
              }
              style={({ isActive }) => ({
                background: isActive ? "rgba(200,164,92,0.12)" : "transparent",
                color: isActive ? gold : creamDim,
                borderLeft: isActive ? `2px solid ${gold}` : "2px solid transparent",
              })}>
              <Icon size={16} />
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-3" style={{ borderTop: `1px solid ${border}` }}>
          <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: "rgba(200,164,92,0.15)", border: `1px solid ${gold}`, color: gold }}>
              {user?.full_name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: cream }}>{user?.full_name}</p>
              <p className="text-[10px] truncate" style={{ color: creamDim }}>{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors"
            style={{ color: "#f87171" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 px-4 lg:px-6 py-4 flex items-center gap-4"
          style={{ background: "rgba(12,10,9,0.95)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${border}` }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 transition-colors"
            style={{ color: creamDim }}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-2 text-xs" style={{ color: creamDim }}>
            <span>Admin</span>
            <ChevronRight size={12} />
            <span style={{ color: cream }}>{pageTitle}</span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
