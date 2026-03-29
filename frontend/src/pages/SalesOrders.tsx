import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  ShoppingCart,
  X,
  ChevronDown,
  Minus,
} from "lucide-react";
import {
  salesOrderApi,
  productApi,
  customerApi,
} from "../services/api";
import type {
  SalesOrder,
  SalesOrderRequest,
  Product,
  Customer,
  OrderStatus,
} from "../services/api";

const statusColors: Record<OrderStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-blue-50 text-blue-700 border-blue-200",
  DISPATCHED: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const nextStatus: Record<OrderStatus, OrderStatus | null> = {
  PENDING: "APPROVED",
  APPROVED: "DISPATCHED",
  DISPATCHED: null,
};

export function SalesOrders() {
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);

  // Create form state
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [orderItems, setOrderItems] = useState<
    { productid: string; quantity: number }[]
  >([]);

  const fetchData = async () => {
    try {
      const [o, p, c] = await Promise.all([
        salesOrderApi.getAll().catch(() => []),
        productApi.getAll().catch(() => []),
        customerApi.getAll().catch(() => []),
      ]);
      setOrders(o);
      setProducts(p);
      setCustomers(c);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addItem = () => {
    setOrderItems([...orderItems, { productid: "", quantity: 1 }]);
  };

  const removeItem = (idx: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== idx));
  };

  const updateItem = (
    idx: number,
    field: "productid" | "quantity",
    value: string | number
  ) => {
    const updated = [...orderItems];
    if (field === "productid") {
      updated[idx].productid = value as string;
    } else {
      updated[idx].quantity = value as number;
    }
    setOrderItems(updated);
  };

  const calcTotal = () => {
    return orderItems.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productid);
      return sum + (product?.price ?? 0) * item.quantity;
    }, 0);
  };

  const handleCreate = async () => {
    if (!selectedCustomer || orderItems.length === 0) return;
    setSaving(true);
    try {
      const req: SalesOrderRequest = {
        customerId: selectedCustomer,
        items: orderItems.filter((i) => i.productid && i.quantity > 0),
      };
      await salesOrderApi.create(req);
      setShowCreate(false);
      setSelectedCustomer("");
      setOrderItems([]);
      await fetchData();
    } catch (err) {
      console.error("Create order failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: OrderStatus) => {
    const next = nextStatus[status];
    if (!next) return;
    try {
      await salesOrderApi.updateStatus(id, next);
      await fetchData();
    } catch (err) {
      console.error("Update status failed:", err);
    }
  };

  const getCustomerName = (id: string) => {
    return customers.find((c) => c.id === id)?.name ?? id;
  };

  const filtered = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      getCustomerName(o.customerId).toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 shadow-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
          />
        </div>
        <button
          onClick={() => {
            setSelectedCustomer("");
            setOrderItems([]);
            setShowCreate(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-purple-200 transition hover:shadow-lg hover:shadow-purple-300"
        >
          <Plus className="h-4 w-4" />
          New Sales Order
        </button>
      </div>

      {/* Status Filter Badges */}
      <div className="flex flex-wrap gap-2">
        {(["ALL", "PENDING", "APPROVED", "DISPATCHED"] as const).map((s) => {
          const count =
            s === "ALL" ? orders.length : orders.filter((o) => o.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setSearch(s === "ALL" ? "" : s)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                (s === "ALL" && !search) || search === s
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}{" "}
              ({count})
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-5 py-3.5">Order ID</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Items</th>
                <th className="px-5 py-3.5">Total</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-gray-400"
                  >
                    <ShoppingCart className="mx-auto mb-2 h-8 w-8" />
                    <p>No orders found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="transition hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 font-mono text-xs font-medium text-gray-800">
                      #{order.id.slice(-6)}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-gray-700">
                      {getCustomerName(order.customerId)}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">
                      {order.orderDate}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">
                      {order.items?.length ?? 0} items
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-gray-800">
                      ₹{order.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusColors[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {nextStatus[order.status] && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(order.id, order.status)
                          }
                          className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600 transition hover:bg-indigo-100"
                        >
                          → {nextStatus[order.status]}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Create Sales Order
              </h3>
              <button
                onClick={() => setShowCreate(false)}
                className="rounded-lg p-1.5 transition hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Customer Selection */}
            <div className="mb-4">
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Customer
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-lg border border-gray-200 px-3 py-2.5 pr-10 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                >
                  <option value="">Select a customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-medium text-gray-600">
                  Order Items
                </label>
                <button
                  onClick={addItem}
                  className="flex items-center gap-1 text-xs font-medium text-purple-600 transition hover:text-purple-700"
                >
                  <Plus className="h-3 w-3" />
                  Add item
                </button>
              </div>
              {orderItems.length === 0 && (
                <p className="rounded-lg border border-dashed border-gray-200 py-6 text-center text-sm text-gray-400">
                  Click "Add item" to add products
                </p>
              )}
              <div className="space-y-2">
                {orderItems.map((item, idx) => {
                  const product = products.find((p) => p.id === item.productid);
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50/50 p-3"
                    >
                      <div className="flex-1">
                        <select
                          className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-purple-400"
                          value={item.productid}
                          onChange={(e) =>
                            updateItem(idx, "productid", e.target.value)
                          }
                        >
                          <option value="">Select product</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.productname} (₹{p.price})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-20">
                        <input
                          type="number"
                          min={1}
                          className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-center text-sm outline-none focus:border-purple-400"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(idx, "quantity", Number(e.target.value))
                          }
                        />
                      </div>
                      <span className="w-24 text-right text-sm font-semibold text-gray-700">
                        ₹{((product?.price ?? 0) * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeItem(idx)}
                        className="rounded-md p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total */}
            {orderItems.length > 0 && (
              <div className="mb-5 flex items-center justify-between rounded-lg bg-purple-50 p-4">
                <span className="text-sm font-medium text-gray-600">
                  Total Amount
                </span>
                <span className="text-xl font-bold text-purple-700">
                  ₹{calcTotal().toLocaleString()}
                </span>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCreate(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={
                  saving ||
                  !selectedCustomer ||
                  orderItems.length === 0 ||
                  orderItems.some((i) => !i.productid)
                }
                className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:shadow-md disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
