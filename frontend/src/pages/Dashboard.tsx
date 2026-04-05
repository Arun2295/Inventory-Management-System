import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  ShoppingCart,
  Package,
  AlertTriangle,
  IndianRupee,
  FileText,
  Truck,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import {
  dashboardApi,
  salesOrderApi,
  productApi,
} from "../services/api";
import type {
  SalesSummary,
  PurchaseSummary,
  StockAlert,
  SalesOrder,
  Product,
} from "../services/api";

/* ───── Animated Counter ───── */
function AnimatedNumber({ value, prefix = "" }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (value === 0) { setDisplay(0); return; }
    const duration = 800;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.round(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);
  return <>{prefix}{display.toLocaleString()}</>;
}

/* ───── Stat Card ───── */
function StatCard({
  title, value, prefix, icon, gradient, subtitle,
}: {
  title: string; value: number; prefix?: string;
  icon: React.ReactNode; gradient: string; subtitle?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100/80">
      <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-300" style={{background: "radial-gradient(circle at top right, currentColor, transparent 70%)"}} />
      <div className="flex items-start justify-between relative">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 tracking-tight">
            <AnimatedNumber value={value} prefix={prefix} />
          </p>
          {subtitle && (
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 mt-1">
              <ArrowUpRight className="h-3 w-3" />
              {subtitle}
            </div>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${gradient} shadow-lg`}>
          {icon}
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 h-1 w-full ${gradient} opacity-60 rounded-b-2xl`} />
    </div>
  );
}

/* ───── Chart Colors ───── */
const ORDER_STATUS_COLORS = ["#f59e0b", "#3b82f6", "#10b981"];
const PURCHASE_COLORS = ["#8b5cf6", "#06b6d4"];
const TOP_PRODUCT_GRADIENT = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"];

/* ───── Custom Tooltip ───── */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-100 bg-white/95 backdrop-blur-sm px-4 py-3 shadow-xl">
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
          {p.name}: {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
}

/* ═══════════════════════════════ DASHBOARD ═══════════════════════════════ */
export function Dashboard() {
  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null);
  const [purchaseSummary, setPurchaseSummary] = useState<PurchaseSummary | null>(null);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const [ss, ps, sa, o, p] = await Promise.all([
        dashboardApi.getSalesSummary().catch(() => null),
        dashboardApi.getPurchaseSummary().catch(() => null),
        dashboardApi.getStockAlerts().catch(() => []),
        salesOrderApi.getAll().catch(() => []),
        productApi.getAll().catch(() => []),
      ]);
      setSalesSummary(ss);
      setPurchaseSummary(ps);
      setStockAlerts(sa);
      setOrders(o);
      setProducts(p);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
          <p className="text-sm text-gray-400 animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  /* ── Derived Data ── */
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const approvedOrders = orders.filter((o) => o.status === "APPROVED").length;
  const dispatchedOrders = orders.filter((o) => o.status === "DISPATCHED").length;

  const orderStatusData = [
    { name: "Pending", value: pendingOrders },
    { name: "Approved", value: approvedOrders },
    { name: "Dispatched", value: dispatchedOrders },
  ].filter((d) => d.value > 0);

  const purchaseStatusData = purchaseSummary
    ? [
        { name: "Ordered", value: purchaseSummary.totalOrders - purchaseSummary.receivedOrders },
        { name: "Received", value: purchaseSummary.receivedOrders },
      ].filter((d) => d.value > 0)
    : [];

  const topProductsChart = (salesSummary?.topProducts ?? []).map((tp) => ({
    name: tp.productName ?? tp.productId.slice(-6),
    quantity: tp.quantity,
  }));

  /* ── Category distribution from products ── */
  const categoryMap: Record<string, number> = {};
  products.forEach((p) => {
    categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="mt-0.5 text-sm text-gray-500">Real-time business analytics and insights</p>
        </div>
        <button
          onClick={() => fetchAll(true)}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition hover:shadow-md hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={salesSummary?.totalSales ?? 0}
          prefix="₹"
          icon={<IndianRupee className="h-6 w-6 text-white" />}
          gradient="bg-gradient-to-br from-indigo-500 to-indigo-600"
          subtitle="All time sales"
        />
        <StatCard
          title="Sales Orders"
          value={salesSummary?.totalOrders ?? orders.length}
          icon={<ShoppingCart className="h-6 w-6 text-white" />}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
          subtitle={`${pendingOrders} pending`}
        />
        <StatCard
          title="Pending Invoices"
          value={salesSummary?.pendingInvoices ?? 0}
          icon={<FileText className="h-6 w-6 text-white" />}
          gradient="bg-gradient-to-br from-amber-500 to-orange-500"
          subtitle="Awaiting payment"
        />
        <StatCard
          title="Purchase Orders"
          value={purchaseSummary?.totalOrders ?? 0}
          icon={<Truck className="h-6 w-6 text-white" />}
          gradient="bg-gradient-to-br from-purple-500 to-pink-500"
          subtitle={`${purchaseSummary?.receivedOrders ?? 0} received`}
        />
      </div>

      {/* ── Charts Row 1 ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Selling Products */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-gray-100/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-800">Top Selling Products</h3>
              <p className="text-xs text-gray-400 mt-0.5">By quantity sold</p>
            </div>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
              {topProductsChart.length} products
            </span>
          </div>
          {topProductsChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topProductsChart} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12, fill: "#475569" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="quantity" name="Qty Sold" radius={[0, 6, 6, 0]} barSize={24}>
                  {topProductsChart.map((_, i) => (
                    <Cell key={i} fill={TOP_PRODUCT_GRADIENT[i % TOP_PRODUCT_GRADIENT.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-60 items-center justify-center text-gray-400">
              <div className="text-center">
                <TrendingUp className="mx-auto mb-2 h-8 w-8" />
                <p className="text-sm">No sales data yet</p>
              </div>
            </div>
          )}
        </div>

        {/* Order Status Pie */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100/80">
          <h3 className="text-base font-semibold text-gray-800 mb-1">Order Status</h3>
          <p className="text-xs text-gray-400 mb-4">Sales order breakdown</p>
          {orderStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {orderStatusData.map((_, i) => (
                    <Cell key={i} fill={ORDER_STATUS_COLORS[i % ORDER_STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(v: string) => <span className="text-xs text-gray-600">{v}</span>}
                />
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-60 items-center justify-center text-gray-400 text-sm">
              No orders yet
            </div>
          )}
        </div>
      </div>

      {/* ── Charts Row 2 ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Purchase Order Status */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100/80">
          <h3 className="text-base font-semibold text-gray-800 mb-1">Purchase Orders</h3>
          <p className="text-xs text-gray-400 mb-4">Ordered vs Received</p>
          {purchaseStatusData.length > 0 ? (
            <div className="flex items-center gap-8">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={purchaseStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {purchaseStatusData.map((_, i) => (
                      <Cell key={i} fill={PURCHASE_COLORS[i % PURCHASE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-4 flex-1">
                {purchaseStatusData.map((d, i) => (
                  <div key={d.name} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: PURCHASE_COLORS[i] }} />
                        <span className="text-sm font-medium text-gray-600">{d.name}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-800">{d.value}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${purchaseSummary && purchaseSummary.totalOrders > 0 ? (d.value / purchaseSummary.totalOrders) * 100 : 0}%`,
                          backgroundColor: PURCHASE_COLORS[i],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-gray-400 text-sm">
              No purchase orders yet
            </div>
          )}
        </div>

        {/* Product Categories */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100/80">
          <h3 className="text-base font-semibold text-gray-800 mb-1">Product Categories</h3>
          <p className="text-xs text-gray-400 mb-4">Distribution across categories</p>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryData} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Products" radius={[6, 6, 0, 0]} barSize={32}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"][i % 6]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-48 items-center justify-center text-gray-400 text-sm">
              <div className="text-center">
                <Package className="mx-auto mb-2 h-8 w-8" />
                <p>No products yet</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Low Stock Alerts + Recent Orders ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Low Stock */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100/80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h3 className="text-base font-semibold text-gray-800">Low Stock Alerts</h3>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
              stockAlerts.length > 0 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
            }`}>
              {stockAlerts.length} items
            </span>
          </div>
          {stockAlerts.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center text-gray-400">
              <TrendingUp className="mb-2 h-8 w-8" />
              <p className="text-sm">All products are well-stocked!</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
              {stockAlerts.map((alert) => {
                const ratio = alert.reorderLevel > 0 ? alert.currentStock / alert.reorderLevel : 0;
                const severity = ratio <= 0.3 ? "critical" : ratio <= 0.7 ? "warning" : "low";
                return (
                  <div
                    key={alert.productId}
                    className={`flex items-center justify-between rounded-xl p-3.5 transition hover:scale-[1.01] ${
                      severity === "critical"
                        ? "border border-red-200 bg-red-50/70"
                        : severity === "warning"
                        ? "border border-amber-200 bg-amber-50/70"
                        : "border border-orange-100 bg-orange-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-2.5 w-2.5 rounded-full ${
                        severity === "critical" ? "bg-red-500 animate-pulse" : severity === "warning" ? "bg-amber-500" : "bg-orange-400"
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{alert.productName}</p>
                        <p className="text-xs text-gray-500">Reorder at: {alert.reorderLevel}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${severity === "critical" ? "text-red-600" : "text-amber-600"}`}>
                        {alert.currentStock} left
                      </p>
                      <div className="mt-1 h-1.5 w-16 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            severity === "critical" ? "bg-red-500" : severity === "warning" ? "bg-amber-500" : "bg-orange-400"
                          }`}
                          style={{ width: `${Math.min(ratio * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Sales Orders */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100/80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-800">Recent Sales Orders</h3>
            <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-600">
              Last {Math.min(orders.length, 6)}
            </span>
          </div>
          {orders.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center text-gray-400">
              <ShoppingCart className="mb-2 h-8 w-8" />
              <p className="text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    <th className="pb-3 pr-4">ID</th>
                    <th className="pb-3 pr-4">Date</th>
                    <th className="pb-3 pr-4">Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.slice(0, 6).map((order) => (
                    <tr key={order.id} className="transition hover:bg-gray-50/50">
                      <td className="py-3 pr-4 font-mono text-xs font-medium text-gray-700">
                        #{order.id.slice(-6)}
                      </td>
                      <td className="py-3 pr-4 text-gray-500 text-xs">{order.orderDate}</td>
                      <td className="py-3 pr-4 font-semibold text-gray-800">
                        ₹{order.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                          order.status === "PENDING"
                            ? "bg-amber-50 text-amber-700"
                            : order.status === "APPROVED"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
