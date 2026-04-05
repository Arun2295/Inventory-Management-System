import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  ShoppingCart,
  ClipboardList,
  PackageCheck,
  Receipt,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/products", label: "Products", icon: Package },
  { path: "/customers", label: "Customers", icon: Users },
  { path: "/suppliers", label: "Suppliers", icon: Truck },
  { path: "/sales-orders", label: "Sales Orders", icon: ShoppingCart },
  { path: "/purchase-orders", label: "Purchase Orders", icon: ClipboardList },
  { path: "/grn", label: "GRN", icon: PackageCheck },
  { path: "/invoices", label: "Invoices", icon: Receipt },
  { path: "/reports", label: "Reports", icon: BarChart3 },
];

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentPage =
    navItems.find((item) => item.path === location.pathname)?.label ??
    "Dashboard";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f0f2f5]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-[#0f172a] text-white transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold">
            ERP
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide">
              Inventory ERP
            </h1>
            <p className="text-[10px] text-slate-400">Management System</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto rounded-md p-1 transition hover:bg-white/10 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Main Menu
          </p>
          {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600/80 to-indigo-500/60 text-white shadow-md shadow-indigo-500/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span>{item.label}</span>
                {isActive && (
                  <ChevronRight className="ml-auto h-4 w-4 opacity-60" />
                )}
              </Link>
            );
          })}

          <p className="mb-2 mt-6 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Operations
          </p>
          {navItems.slice(5, 8).map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600/80 to-indigo-500/60 text-white shadow-md shadow-indigo-500/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span>{item.label}</span>
                {isActive && (
                  <ChevronRight className="ml-auto h-4 w-4 opacity-60" />
                )}
              </Link>
            );
          })}

          <p className="mb-2 mt-6 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Analytics
          </p>
          {navItems.slice(8).map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600/80 to-indigo-500/60 text-white shadow-md shadow-indigo-500/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span>{item.label}</span>
                {isActive && (
                  <ChevronRight className="ml-auto h-4 w-4 opacity-60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-xs font-bold uppercase">
              {user?.username?.charAt(0) ?? "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.username}</p>
              <p className="truncate text-[11px] text-slate-400">
                {user?.role}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-2 transition hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>

          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-800">
              {currentPage}
            </h2>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-gray-500 sm:block">
              Welcome, <strong className="text-gray-700">{user?.username}</strong>
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold uppercase text-indigo-700">
              {user?.username?.charAt(0) ?? "U"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
