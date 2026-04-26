import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, Tags, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/categories", label: "Categories", icon: Tags },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-dark flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-white/10">
          <p className="text-brand-cream font-serif text-lg">Thread Tales</p>
          <p className="text-brand-gold text-xs mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-brand-gold text-white" : "text-brand-cream/60 hover:text-brand-cream hover:bg-white/10"}`
              }
              onClick={() => setSidebarOpen(false)}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-brand-gold/20 rounded-full flex items-center justify-center text-brand-gold text-sm font-bold">
              {user?.full_name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-brand-cream text-xs font-medium truncate">{user?.full_name}</p>
              <p className="text-brand-cream/40 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 text-sm transition-colors">
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex-1" />
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
