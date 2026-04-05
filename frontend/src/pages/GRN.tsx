import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  PackageCheck,
  X,
  ChevronDown,
  Minus,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";
import {
  grnApi,
  purchaseOrderApi,
  productApi,
} from "../services/api";
import type {
  GrnResponse,
  GrnRequest,
  PurchaseOrder,
  Product,
} from "../services/api";

export function GRN() {
  const [grns, setGrns] = useState<GrnResponse[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form
  const [selectedPO, setSelectedPO] = useState("");
  const [grnItems, setGrnItems] = useState<{ productId: string; quantity: number }[]>([]);

  const fetchData = async () => {
    try {
      const [g, po, p] = await Promise.all([
        grnApi.getAll().catch(() => []),
        purchaseOrderApi.getAll().catch(() => []),
        productApi.getAll().catch(() => []),
      ]);
      setGrns(g);
      setPurchaseOrders(po);
      setProducts(p);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const getProductName = (id: string) =>
    products.find((p) => p.id === id)?.productname ?? id;

  // When a PO is selected, pre-fill items from PO
  const handleSelectPO = (poId: string) => {
    setSelectedPO(poId);
    const po = purchaseOrders.find((p) => p.id === poId);
    if (po?.items) {
      setGrnItems(po.items.map((item) => ({ productId: item.productId, quantity: item.quantity })));
    } else {
      setGrnItems([]);
    }
  };

  const addItem = () => setGrnItems([...grnItems, { productId: "", quantity: 1 }]);
  const removeItem = (idx: number) => setGrnItems(grnItems.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: "productId" | "quantity", value: string | number) => {
    const updated = [...grnItems];
    if (field === "productId") updated[idx].productId = value as string;
    else updated[idx].quantity = value as number;
    setGrnItems(updated);
  };

  const handleCreate = async () => {
    if (!selectedPO || grnItems.length === 0) return;
    setSaving(true);
    try {
      const req: GrnRequest = {
        purchaseOrderId: selectedPO,
        items: grnItems.filter((i) => i.productId && i.quantity > 0),
      };
      await grnApi.create(req);
      setShowCreate(false);
      setSelectedPO("");
      setGrnItems([]);
      await fetchData();
    } catch (err) {
      console.error("Create GRN failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const filtered = grns.filter(
    (g) =>
      g.id.toLowerCase().includes(search.toLowerCase()) ||
      g.purchaseOrderId.toLowerCase().includes(search.toLowerCase())
  );

  // Only show POs with status ORDERED for GRN creation
  const availablePOs = purchaseOrders.filter((po) => po.status === "ORDERED");

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600" />
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
            placeholder="Search GRNs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 shadow-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
          />
        </div>
        <button
          onClick={() => { setSelectedPO(""); setGrnItems([]); setShowCreate(true); }}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-500 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-teal-200 transition hover:shadow-lg hover:shadow-teal-300"
        >
          <Plus className="h-4 w-4" />
          Record GRN
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100/80">
          <p className="text-xs font-medium text-gray-500">Total GRNs</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{grns.length}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100/80">
          <p className="text-xs font-medium text-gray-500">Products Received</p>
          <p className="mt-1 text-2xl font-bold text-teal-600">
            {grns.reduce((sum, g) => sum + (g.items?.length ?? 0), 0)}
          </p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100/80">
          <p className="text-xs font-medium text-gray-500">Pending POs</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">{availablePOs.length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100/80">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-5 py-3.5">GRN ID</th>
                <th className="px-5 py-3.5">Purchase Order</th>
                <th className="px-5 py-3.5">Received Date</th>
                <th className="px-5 py-3.5">Items Received</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-400">
                    <PackageCheck className="mx-auto mb-2 h-8 w-8" />
                    <p>No GRNs found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((grn) => (
                  <tr key={grn.id} className="transition hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 font-mono text-xs font-medium text-gray-800">
                      #{grn.id.slice(-6)}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-600">
                      PO-{grn.purchaseOrderId.slice(-6)}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
                        {grn.receivedDate}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="space-y-0.5">
                        {grn.items?.map((item, i) => (
                          <p key={i} className="text-xs text-gray-600">
                            {getProductName(item.productId)} × <span className="font-semibold text-gray-800">{item.quantity}</span>
                          </p>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" />
                        Stock Updated
                      </span>
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
              <h3 className="text-lg font-semibold text-gray-800">Record Goods Receipt Note</h3>
              <button onClick={() => setShowCreate(false)} className="rounded-lg p-1.5 transition hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Select Purchase Order */}
            <div className="mb-4">
              <label className="mb-1 block text-xs font-medium text-gray-600">Purchase Order</label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-lg border border-gray-200 px-3 py-2.5 pr-10 text-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                  value={selectedPO}
                  onChange={(e) => handleSelectPO(e.target.value)}
                >
                  <option value="">Select a purchase order</option>
                  {availablePOs.map((po) => (
                    <option key={po.id} value={po.id}>
                      PO-{po.id.slice(-6)} — {po.items?.length ?? 0} items (Expected: {po.expectedDeliveryDate})
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
              {availablePOs.length === 0 && (
                <p className="mt-2 text-xs text-amber-600">No pending purchase orders available for GRN.</p>
              )}
            </div>

            {/* GRN Items */}
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-medium text-gray-600">Received Items</label>
                <button onClick={addItem} className="flex items-center gap-1 text-xs font-medium text-teal-600 transition hover:text-teal-700">
                  <Plus className="h-3 w-3" /> Add item
                </button>
              </div>
              {grnItems.length === 0 && (
                <p className="rounded-lg border border-dashed border-gray-200 py-6 text-center text-sm text-gray-400">
                  Select a PO to auto-fill or add items manually
                </p>
              )}
              <div className="space-y-2">
                {grnItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50/50 p-3">
                    <div className="flex-1">
                      <select
                        className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-teal-400"
                        value={item.productId}
                        onChange={(e) => updateItem(idx, "productId", e.target.value)}
                      >
                        <option value="">Select product</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>{p.productname}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-20">
                      <input
                        type="number"
                        min={1}
                        className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-center text-sm outline-none focus:border-teal-400"
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

            {grnItems.length > 0 && (
              <div className="mb-5 rounded-lg bg-teal-50 p-4">
                <p className="text-xs font-medium text-teal-700">
                  ✓ Submitting this GRN will update stock for {grnItems.filter((i) => i.productId).length} product(s)
                </p>
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
                disabled={saving || !selectedPO || grnItems.length === 0 || grnItems.some((i) => !i.productId)}
                className="rounded-lg bg-gradient-to-r from-teal-600 to-cyan-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:shadow-md disabled:opacity-50"
              >
                {saving ? "Recording..." : "Record GRN"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
