import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  ClipboardList,
  X,
  ChevronDown,
  Minus,
  Truck,
  CalendarDays,
} from "lucide-react";
import {
  purchaseOrderApi,
  productApi,
  supplierApi,
} from "../services/api";
import type {
  PurchaseOrder,
  PurchaseOrderRequest,
  Product,
  Supplier,
  PurchaseOrderStatus,
} from "../services/api";

const statusColors: Record<PurchaseOrderStatus, string> = {
  ORDERED: "bg-amber-50 text-amber-700 border-amber-200",
  RECEIVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export function PurchaseOrders() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | PurchaseOrderStatus>("ALL");
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [orderItems, setOrderItems] = useState<{ productId: string; quantity: number }[]>([]);

  const fetchData = async () => {
    try {
      const [o, p, s] = await Promise.all([
        purchaseOrderApi.getAll().catch(() => []),
        productApi.getAll().catch(() => []),
        supplierApi.getAll().catch(() => []),
      ]);
      setOrders(o);
      setProducts(p);
      setSuppliers(s);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const addItem = () => setOrderItems([...orderItems, { productId: "", quantity: 1 }]);
  const removeItem = (idx: number) => setOrderItems(orderItems.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: "productId" | "quantity", value: string | number) => {
    const updated = [...orderItems];
    if (field === "productId") updated[idx].productId = value as string;
    else updated[idx].quantity = value as number;
    setOrderItems(updated);
  };

  const handleCreate = async () => {
    if (!selectedSupplier || !expectedDate || orderItems.length === 0) return;
    setSaving(true);
    try {
      const req: PurchaseOrderRequest = {
        supplierId: selectedSupplier,
        expectedDeliveryDate: expectedDate,
        items: orderItems.filter((i) => i.productId && i.quantity > 0),
      };
      await purchaseOrderApi.create(req);
      setShowCreate(false);
      resetForm();
      await fetchData();
    } catch (err) {
      console.error("Create PO failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleMarkReceived = async (id: string) => {
    try {
      await purchaseOrderApi.updateStatus(id, "RECEIVED");
      await fetchData();
    } catch (err) {
      console.error("Update status failed:", err);
    }
  };

  const resetForm = () => {
    setSelectedSupplier("");
    setExpectedDate("");
    setOrderItems([]);
  };

  const getSupplierName = (id: string) =>
    suppliers.find((s) => s.id === id)?.name ?? id;

  const getProductName = (id: string) =>
    products.find((p) => p.id === id)?.productname ?? id;

  const filtered = orders.filter((o) => {
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      getSupplierName(o.supplierId).toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
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
            placeholder="Search purchase orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 shadow-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
          />
        </div>
        <button
          onClick={() => { resetForm(); setShowCreate(true); }}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-violet-500 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-purple-200 transition hover:shadow-lg hover:shadow-purple-300"
        >
          <Plus className="h-4 w-4" />
          New Purchase Order
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(["ALL", "ORDERED", "RECEIVED"] as const).map((s) => {
          const count = s === "ALL" ? orders.length : orders.filter((o) => o.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                statusFilter === s
                  ? "border-purple-300 bg-purple-50 text-purple-700"
                  : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()} ({count})
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100/80">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-5 py-3.5">PO ID</th>
                <th className="px-5 py-3.5">Supplier</th>
                <th className="px-5 py-3.5">Items</th>
                <th className="px-5 py-3.5">Expected Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                    <ClipboardList className="mx-auto mb-2 h-8 w-8" />
                    <p>No purchase orders found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="transition hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 font-mono text-xs font-medium text-gray-800">
                      #{order.id.slice(-6)}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-gray-700">
                      <div className="flex items-center gap-2">
                        <Truck className="h-3.5 w-3.5 text-gray-400" />
                        {getSupplierName(order.supplierId)}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">
                      <div className="space-y-0.5">
                        {order.items?.map((item, i) => (
                          <p key={i} className="text-xs">
                            {getProductName(item.productId)} × {item.quantity}
                          </p>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
                        {order.expectedDeliveryDate}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {order.status === "ORDERED" && (
                        <button
                          onClick={() => handleMarkReceived(order.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600 transition hover:bg-emerald-100"
                        >
                          ✓ Mark Received
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

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Create Purchase Order</h3>
              <button onClick={() => setShowCreate(false)} className="rounded-lg p-1.5 transition hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Supplier */}
            <div className="mb-4">
              <label className="mb-1 block text-xs font-medium text-gray-600">Supplier</label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-lg border border-gray-200 px-3 py-2.5 pr-10 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                >
                  <option value="">Select a supplier</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.email})
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Expected Delivery Date */}
            <div className="mb-4">
              <label className="mb-1 block text-xs font-medium text-gray-600">Expected Delivery Date</label>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
              />
            </div>

            {/* Items */}
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-medium text-gray-600">Order Items</label>
                <button onClick={addItem} className="flex items-center gap-1 text-xs font-medium text-purple-600 transition hover:text-purple-700">
                  <Plus className="h-3 w-3" /> Add item
                </button>
              </div>
              {orderItems.length === 0 && (
                <p className="rounded-lg border border-dashed border-gray-200 py-6 text-center text-sm text-gray-400">
                  Click "Add item" to add products
                </p>
              )}
              <div className="space-y-2">
                {orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50/50 p-3">
                    <div className="flex-1">
                      <select
                        className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-purple-400"
                        value={item.productId}
                        onChange={(e) => updateItem(idx, "productId", e.target.value)}
                      >
                        <option value="">Select product</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.productname} (Stock: {p.currentstock})
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
                        onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))}
                      />
                    </div>
                    <button
                      onClick={() => removeItem(idx)}
                      className="rounded-md p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCreate(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={saving || !selectedSupplier || !expectedDate || orderItems.length === 0 || orderItems.some((i) => !i.productId)}
                className="rounded-lg bg-gradient-to-r from-purple-600 to-violet-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:shadow-md disabled:opacity-50"
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
