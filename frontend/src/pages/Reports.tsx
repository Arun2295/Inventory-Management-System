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
  DollarSign,
  ShoppingCart,
  Package,
  Truck,
  AlertTriangle,
  FileText,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";
import {
  dashboardApi,
  salesOrderApi,
  purchaseOrderApi,
  invoiceApi,
  productApi,
} from "../services/api";
import type {
  SalesSummary,
  PurchaseSummary,
  StockAlert,
  SalesOrder,
  PurchaseOrder,
  InvoiceResponse,
  Product,
} from "../services/api";

/* ───── Animated Number ───── */
function AnimatedNumber({ value, prefix = "" }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (value === 0) { setDisplay(0); return; }
    const steps = 25;
    const inc = value / steps;
    let cur = 0, step = 0;
    const t = setInterval(() => {
      step++; cur += inc;
      if (step >= steps) { setDisplay(value); clearInterval(t); }
      else setDisplay(Math.round(cur));
    }, 30);
    return () => clearInterval(t);
  }, [value]);
  return <>{prefix}{display.toLocaleString()}</>;
}

/* ───── Summary Card ───── */
function SummaryCard({
  title, value, prefix, icon, gradient, subtitle,
}: {
  title: string; value: number; prefix?: string;
  icon: React.ReactNode; gradient: string; subtitle?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm border border-gray-100/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500">{title}</p>
          <p className="mt-1.5 text-2xl font-bold text-gray-900 tracking-tight">
            <AnimatedNumber value={value} prefix={prefix} />
          </p>
          {subtitle && (
            <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-emerald-600">
              <ArrowUpRight className="h-3 w-3" /> {subtitle}
            </p>
          )}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${gradient}`}>
          {icon}
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 h-1 w-full ${gradient} opacity-50`} />
    </div>
  );
}

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

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4", "#f43f5e"];
const ORDER_COLORS = ["#f59e0b", "#3b82f6", "#10b981"];
const PO_COLORS = ["#8b5cf6", "#06b6d4"];
const INVOICE_COLORS = ["#10b981", "#ef4444"];

/* ═══════════════════════════════ REPORTS ═══════════════════════════════ */
export function Reports() {
  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null);
  const [purchaseSummary, setPurchaseSummary] = useState<PurchaseSummary | null>(null);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const [ss, ps, sa, o, po, inv, p] = await Promise.all([
        dashboardApi.getSalesSummary().catch(() => null),
        dashboardApi.getPurchaseSummary().catch(() => null),
        dashboardApi.getStockAlerts().catch(() => []),
        salesOrderApi.getAll().catch(() => []),
        purchaseOrderApi.getAll().catch(() => []),
        invoiceApi.getAll().catch(() => []),
        productApi.getAll().catch(() => []),
      ]);
      setSalesSummary(ss);
      setPurchaseSummary(ps);
      setStockAlerts(sa);
      setOrders(o);
      setPurchaseOrders(po);
      setInvoices(inv);
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
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" />
          <p className="text-sm text-gray-400 animate-pulse">Loading reports...</p>
        </div>
      </div>
    );
  }

  /* ── Derived Data ── */
  const topProductsChart = (salesSummary?.topProducts ?? []).map((tp) => ({
    name: tp.productName ?? tp.productId.slice(-6),
    quantity: tp.quantity,
  }));

  const orderStatusData = [
    { name: "Pending", value: orders.filter((o) => o.status === "PENDING").length },
    { name: "Approved", value: orders.filter((o) => o.status === "APPROVED").length },
    { name: "Dispatched", value: orders.filter((o) => o.status === "DISPATCHED").length },
  ].filter((d) => d.value > 0);

  const poStatusData = purchaseSummary
    ? [
        { name: "Ordered", value: purchaseSummary.totalOrders - purchaseSummary.receivedOrders },
        { name: "Received", value: purchaseSummary.receivedOrders },
      ].filter((d) => d.value > 0)
    : [];

  const invoiceStatusData = [
    { name: "Paid", value: invoices.filter((i) => i.status === "PAID").length },
    { name: "Unpaid", value: invoices.filter((i) => i.status === "UNPAID").length },
  ].filter((d) => d.value > 0);

  // Category distribution
  const categoryMap: Record<string, number> = {};
  products.forEach((p) => { categoryMap[p.category] = (categoryMap[p.category] || 0) + 1; });
  const categoryData = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  // Stock level chart
  const stockLevelData = products
    .sort((a, b) => a.currentstock - b.currentstock)
    .slice(0, 10)
    .map((p) => ({
      name: p.productname.length > 15 ? p.productname.slice(0, 15) + "…" : p.productname,
      stock: p.currentstock,
      reorder: p.reorderlevel,
    }));

  const totalInvoiceValue = invoices.reduce((s, i) => s + i.totalPayable, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-0.5 text-sm text-gray-500">Comprehensive business performance overview</p>
        </div>
        <button
          onClick={() => fetchAll(true)}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition hover:shadow-md hover:border-violet-200 hover:text-violet-600 disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <SummaryCard
          title="Total Revenue"
          value={salesSummary?.totalSales ?? 0}
          prefix="₹"
          icon={<DollarSign className="h-5 w-5 text-white" />}
          gradient="bg-gradient-to-br from-indigo-500 to-indigo-600"
        />
        <SummaryCard
          title="Sales Orders"
          value={salesSummary?.totalOrders ?? orders.length}
          icon={<ShoppingCart className="h-5 w-5 text-white" />}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
        <SummaryCard
          title="Purchase Orders"
          value={purchaseSummary?.totalOrders ?? 0}
          icon={<Truck className="h-5 w-5 text-white" />}
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <SummaryCard
          title="Total Invoiced"
          value={totalInvoiceValue}
          prefix="₹"
          icon={<FileText className="h-5 w-5 text-white" />}
          gradient="bg-gradient-to-br from-rose-500 to-pink-500"
        />
        <SummaryCard
          title="Products"
          value={products.length}
          icon={<Package className="h-5 w-5 text-white" />}
          gradient="bg-gradient-to-br from-amber-500 to-orange-500"
        />
        <SummaryCard
          title="Stock Alerts"
          value={stockAlerts.length}
          icon={<AlertTriangle className="h-5 w-5 text-white" />}
          gradient="bg-gradient-to-br from-red-500 to-red-600"
          subtitle={stockAlerts.length > 0 ? "Needs attention" : "All good"}
        />
      </div>

      {/* Row 1: Top Products + Order Status */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-gray-100/80">
          <h3 className="text-base font-semibold text-gray-800 mb-1">Top Selling Products</h3>
          <p className="text-xs text-gray-400 mb-4">Products with highest units sold</p>
          {topProductsChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topProductsChart} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 12, fill: "#475569" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="quantity" name="Qty Sold" radius={[0, 8, 8, 0]} barSize={24}>
                  {topProductsChart.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-60 items-center justify-center text-gray-400 text-sm">
              <div className="text-center"><TrendingUp className="mx-auto mb-2 h-8 w-8" /><p>No sales data yet</p></div>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100/80">
          <h3 className="text-base font-semibold text-gray-800 mb-1">Sales Order Status</h3>
          <p className="text-xs text-gray-400 mb-4">Current order breakdown</p>
          {orderStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={orderStatusData} cx="50%" cy="45%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" strokeWidth={0}>
                  {orderStatusData.map((_, i) => (<Cell key={i} fill={ORDER_COLORS[i % ORDER_COLORS.length]} />))}
                </Pie>
                <Legend verticalAlign="bottom" formatter={(v: string) => <span className="text-xs text-gray-600">{v}</span>} />
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-60 items-center justify-center text-gray-400 text-sm">No orders</div>
          )}
        </div>
      </div>

      {/* Row 2: Stock Levels + Categories */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100/80">
          <h3 className="text-base font-semibold text-gray-800 mb-1">Stock Levels</h3>
          <p className="text-xs text-gray-400 mb-4">Current stock vs reorder level (lowest 10)</p>
          {stockLevelData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stockLevelData} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} angle={-25} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="stock" name="Current Stock" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={18} />
                <Bar dataKey="reorder" name="Reorder Level" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={18} />
                <Legend formatter={(v: string) => <span className="text-xs text-gray-600">{v}</span>} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-60 items-center justify-center text-gray-400 text-sm">No products</div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100/80">
          <h3 className="text-base font-semibold text-gray-800 mb-1">Product Categories</h3>
          <p className="text-xs text-gray-400 mb-4">Product distribution by category</p>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="45%" outerRadius={85} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {categoryData.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                </Pie>
                <Legend verticalAlign="bottom" formatter={(v: string) => <span className="text-xs text-gray-600">{v}</span>} />
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-60 items-center justify-center text-gray-400 text-sm">No products</div>
          )}
        </div>
      </div>

      {/* Row 3: PO Status + Invoice Status */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100/80">
          <h3 className="text-base font-semibold text-gray-800 mb-1">Purchase Order Status</h3>
          <p className="text-xs text-gray-400 mb-4">Ordered vs Received</p>
          {poStatusData.length > 0 ? (
            <div className="flex items-center gap-8">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie data={poStatusData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value" strokeWidth={0}>
                    {poStatusData.map((_, i) => (<Cell key={i} fill={PO_COLORS[i % PO_COLORS.length]} />))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-4 flex-1">
                {poStatusData.map((d, i) => (
                  <div key={d.name} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: PO_COLORS[i] }} />
                        <span className="text-sm font-medium text-gray-600">{d.name}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-800">{d.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${purchaseSummary && purchaseSummary.totalOrders > 0 ? (d.value / purchaseSummary.totalOrders) * 100 : 0}%`,
                          backgroundColor: PO_COLORS[i],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-gray-400 text-sm">No purchase orders</div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100/80">
          <h3 className="text-base font-semibold text-gray-800 mb-1">Invoice Status</h3>
          <p className="text-xs text-gray-400 mb-4">Paid vs Unpaid invoices</p>
          {invoiceStatusData.length > 0 ? (
            <div className="flex items-center gap-8">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie data={invoiceStatusData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value" strokeWidth={0}>
                    {invoiceStatusData.map((_, i) => (<Cell key={i} fill={INVOICE_COLORS[i % INVOICE_COLORS.length]} />))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-4 flex-1">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500">Total Paid</p>
                  <p className="text-lg font-bold text-emerald-600">
                    ₹{invoices.filter((i) => i.status === "PAID").reduce((s, i) => s + i.totalPayable, 0).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500">Total Unpaid</p>
                  <p className="text-lg font-bold text-red-600">
                    ₹{invoices.filter((i) => i.status === "UNPAID").reduce((s, i) => s + i.totalPayable, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-gray-400 text-sm">No invoices</div>
          )}
        </div>
      </div>

      {/* Row 4: Stock Alerts Table */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h3 className="text-base font-semibold text-gray-800">Low Stock Alert Details</h3>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${
            stockAlerts.length > 0 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
          }`}>
            {stockAlerts.length} products
          </span>
        </div>
        {stockAlerts.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-gray-400 text-sm">
            All products are above reorder level ✓
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  <th className="pb-3 pr-4">Product</th>
                  <th className="pb-3 pr-4">Current Stock</th>
                  <th className="pb-3 pr-4">Reorder Level</th>
                  <th className="pb-3 pr-4">Deficit</th>
                  <th className="pb-3">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stockAlerts.map((alert) => {
                  const deficit = alert.reorderLevel - alert.currentStock;
                  const ratio = alert.reorderLevel > 0 ? alert.currentStock / alert.reorderLevel : 0;
                  const severity = ratio <= 0.3 ? "Critical" : ratio <= 0.7 ? "Warning" : "Low";
                  return (
                    <tr key={alert.productId} className="transition hover:bg-gray-50/50">
                      <td className="py-3 pr-4 font-medium text-gray-800">{alert.productName}</td>
                      <td className="py-3 pr-4">
                        <span className="font-semibold text-gray-800">{alert.currentStock}</span>
                      </td>
                      <td className="py-3 pr-4 text-gray-500">{alert.reorderLevel}</td>
                      <td className="py-3 pr-4">
                        <span className="font-semibold text-red-600">-{deficit}</span>
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                          severity === "Critical"
                            ? "bg-red-50 text-red-700"
                            : severity === "Warning"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-orange-50 text-orange-700"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            severity === "Critical" ? "bg-red-500 animate-pulse" : severity === "Warning" ? "bg-amber-500" : "bg-orange-400"
                          }`} />
                          {severity}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
