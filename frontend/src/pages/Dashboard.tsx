import { useEffect, useState } from "react";
import {
  Package,
  Users,
  Truck,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { productApi, customerApi, supplierApi, salesOrderApi } from "../services/api";
import type { Product, Customer, Supplier, SalesOrder } from "../services/api";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
  trend?: string;
  trendUp?: boolean;
}

function StatCard({ title, value, icon, gradient, trend, trendUp }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${trendUp ? "text-emerald-600" : "text-red-500"}`}>
              {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {trend}
            </div>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${gradient}`}>
          {icon}
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 h-1 w-full ${gradient} opacity-60`} />
    </div>
  );
}

function StatusBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-600">{label}</span>
        <span className="font-semibold text-gray-800">
          {count} <span className="text-xs text-gray-400">({pct.toFixed(0)}%)</span>
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [p, c, s, o] = await Promise.all([
          productApi.getAll().catch(() => []),
          customerApi.getAll().catch(() => []),
          supplierApi.getAll().catch(() => []),
          salesOrderApi.getAll().catch(() => []),
        ]);
        setProducts(p);
        setCustomers(c);
        setSuppliers(s);
        setOrders(o);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  const lowStockProducts = products.filter(
    (p) => p.currentstock <= p.reorderlevel
  );
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const approvedOrders = orders.filter((o) => o.status === "APPROVED").length;
  const dispatchedOrders = orders.filter((o) => o.status === "DISPATCHED").length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Products"
          value={products.length}
          icon={<Package className="h-6 w-6 text-white" />}
          gradient="bg-gradient-to-br from-indigo-500 to-indigo-600"
          trend="Inventory tracked"
          trendUp
        />
        <StatCard
          title="Total Customers"
          value={customers.length}
          icon={<Users className="h-6 w-6 text-white" />}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
          trend="Active accounts"
          trendUp
        />
        <StatCard
          title="Total Suppliers"
          value={suppliers.length}
          icon={<Truck className="h-6 w-6 text-white" />}
          gradient="bg-gradient-to-br from-amber-500 to-orange-500"
          trend="Supply chain"
          trendUp
        />
        <StatCard
          title="Sales Orders"
          value={orders.length}
          icon={<ShoppingCart className="h-6 w-6 text-white" />}
          gradient="bg-gradient-to-br from-purple-500 to-pink-500"
          trend={`₹${totalRevenue.toLocaleString()} total`}
          trendUp
        />
      </div>

      {/* Charts + Alerts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Order Status Distribution */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-800">
              Order Status Distribution
            </h3>
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
              {orders.length} total
            </span>
          </div>
          <div className="space-y-4">
            <StatusBar
              label="Pending"
              count={pendingOrders}
              total={orders.length}
              color="bg-gradient-to-r from-amber-400 to-amber-500"
            />
            <StatusBar
              label="Approved"
              count={approvedOrders}
              total={orders.length}
              color="bg-gradient-to-r from-blue-400 to-blue-500"
            />
            <StatusBar
              label="Dispatched"
              count={dispatchedOrders}
              total={orders.length}
              color="bg-gradient-to-r from-emerald-400 to-emerald-500"
            />
          </div>

          {/* Donut visualization */}
          {orders.length > 0 && (
            <div className="mt-6 flex items-center justify-center gap-8">
              <div className="relative h-28 w-28">
                <svg viewBox="0 0 36 36" className="h-28 w-28 -rotate-90">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.5" fill="none" stroke="#f59e0b" strokeWidth="3"
                    strokeDasharray={`${(pendingOrders / orders.length) * 97.4} 97.4`}
                    strokeLinecap="round"
                  />
                  <circle
                    cx="18" cy="18" r="15.5" fill="none" stroke="#3b82f6" strokeWidth="3"
                    strokeDasharray={`${(approvedOrders / orders.length) * 97.4} 97.4`}
                    strokeDashoffset={`${-(pendingOrders / orders.length) * 97.4}`}
                    strokeLinecap="round"
                  />
                  <circle
                    cx="18" cy="18" r="15.5" fill="none" stroke="#10b981" strokeWidth="3"
                    strokeDasharray={`${(dispatchedOrders / orders.length) * 97.4} 97.4`}
                    strokeDashoffset={`${-((pendingOrders + approvedOrders) / orders.length) * 97.4}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-gray-800">{orders.length}</span>
                  <span className="text-[10px] text-gray-400">Orders</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="text-gray-600">Pending ({pendingOrders})</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <span className="text-gray-600">Approved ({approvedOrders})</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="text-gray-600">Dispatched ({dispatchedOrders})</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-800">
              <AlertTriangle className="mr-2 inline-block h-4 w-4 text-amber-500" />
              Low Stock Alerts
            </h3>
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${lowStockProducts.length > 0 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
              {lowStockProducts.length} items
            </span>
          </div>
          {lowStockProducts.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-gray-400">
              <TrendingUp className="mb-2 h-8 w-8" />
              <p className="text-sm">All products are well-stocked!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50/50 p-3 transition hover:bg-red-50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {p.productname}
                    </p>
                    <p className="text-xs text-gray-500">SKU: {p.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-600">
                      {p.currentstock} left
                    </p>
                    <p className="text-xs text-gray-400">
                      Reorder at: {p.reorderlevel}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-gray-800">
          Recent Sales Orders
        </h3>
        {orders.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">
            No orders yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  <th className="pb-3 pr-4">Order ID</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Items</th>
                  <th className="pb-3 pr-4">Total</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="transition hover:bg-gray-50/50">
                    <td className="py-3 pr-4 font-medium text-gray-800">
                      #{order.id.slice(-6)}
                    </td>
                    <td className="py-3 pr-4 text-gray-500">{order.orderDate}</td>
                    <td className="py-3 pr-4 text-gray-500">
                      {order.items?.length ?? 0} items
                    </td>
                    <td className="py-3 pr-4 font-semibold text-gray-800">
                      ₹{order.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          order.status === "PENDING"
                            ? "bg-amber-50 text-amber-700"
                            : order.status === "APPROVED"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
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
  );
}
