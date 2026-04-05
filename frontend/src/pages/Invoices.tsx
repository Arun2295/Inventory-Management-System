import { useEffect, useState } from "react";
import {
  Search,
  Receipt,
  Download,
  FileText,
  Plus,
  ChevronDown,
  X,
  IndianRupee,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  invoiceApi,
  salesOrderApi,
  customerApi,
} from "../services/api";
import type {
  InvoiceResponse,
  InvoiceStatus,
  SalesOrder,
  Customer,
} from "../services/api";

const statusConfig: Record<InvoiceStatus, { bg: string; icon: typeof CheckCircle2 }> = {
  PAID: { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  UNPAID: { bg: "bg-red-50 text-red-600 border-red-200", icon: Clock },
};

export function Invoices() {
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | InvoiceStatus>("ALL");
  const [showGenerate, setShowGenerate] = useState(false);
  const [selectedSO, setSelectedSO] = useState("");
  const [generating, setGenerating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [inv, so, cust] = await Promise.all([
        invoiceApi.getAll().catch(() => []),
        salesOrderApi.getAll().catch(() => []),
        customerApi.getAll().catch(() => []),
      ]);
      setInvoices(inv);
      setSalesOrders(so);
      setCustomers(cust);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const getCustomerName = (id: string) =>
    customers.find((c) => c.id === id)?.name ?? id;

  // Only approved orders that don't have an invoice yet
  const invoicedSOIds = new Set(invoices.map((inv) => inv.salesOrderId));
  const availableOrders = salesOrders.filter(
    (so) => so.status === "APPROVED" && !invoicedSOIds.has(so.id)
  );

  const handleGenerate = async () => {
    if (!selectedSO) return;
    setGenerating(true);
    try {
      await invoiceApi.generate(selectedSO);
      setShowGenerate(false);
      setSelectedSO("");
      await fetchData();
    } catch (err) {
      console.error("Generate invoice failed:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPdf = async (id: string) => {
    try {
      const blob = await invoiceApi.downloadPdf(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${id.slice(-6)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download PDF failed:", err);
    }
  };

  const filtered = invoices.filter((inv) => {
    const matchesStatus = statusFilter === "ALL" || inv.status === statusFilter;
    const matchesSearch =
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      getCustomerName(inv.customerId).toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPayable = invoices.reduce((sum, inv) => sum + inv.totalPayable, 0);
  const totalPaid = invoices.filter((i) => i.status === "PAID").reduce((sum, inv) => sum + inv.totalPayable, 0);
  const totalUnpaid = invoices.filter((i) => i.status === "UNPAID").reduce((sum, inv) => sum + inv.totalPayable, 0);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-200 border-t-rose-600" />
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
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 shadow-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
          />
        </div>
        <button
          onClick={() => { setSelectedSO(""); setShowGenerate(true); }}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-rose-600 to-pink-500 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-rose-200 transition hover:shadow-lg hover:shadow-rose-300"
        >
          <Plus className="h-4 w-4" />
          Generate Invoice
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100/80">
          <div className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-gray-400" />
            <p className="text-xs font-medium text-gray-500">Total Invoiced</p>
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900">₹{totalPayable.toLocaleString()}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100/80">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <p className="text-xs font-medium text-gray-500">Paid</p>
          </div>
          <p className="mt-1 text-2xl font-bold text-emerald-600">₹{totalPaid.toLocaleString()}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100/80">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-red-500" />
            <p className="text-xs font-medium text-gray-500">Unpaid</p>
          </div>
          <p className="mt-1 text-2xl font-bold text-red-600">₹{totalUnpaid.toLocaleString()}</p>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {(["ALL", "PAID", "UNPAID"] as const).map((s) => {
          const count = s === "ALL" ? invoices.length : invoices.filter((i) => i.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                statusFilter === s
                  ? "border-rose-300 bg-rose-50 text-rose-700"
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
                <th className="px-5 py-3.5">Invoice ID</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Sales Order</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Tax</th>
                <th className="px-5 py-3.5">Total Payable</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-gray-400">
                    <Receipt className="mx-auto mb-2 h-8 w-8" />
                    <p>No invoices found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => {
                  const StatusIcon = statusConfig[inv.status].icon;
                  return (
                    <tr key={inv.id} className="transition hover:bg-gray-50/50 group">
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => setExpandedId(expandedId === inv.id ? null : inv.id)}
                          className="font-mono text-xs font-medium text-indigo-600 hover:text-indigo-800 transition"
                        >
                          #{inv.id.slice(-6)}
                        </button>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-gray-700">
                        {getCustomerName(inv.customerId)}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-500">
                        SO-{inv.salesOrderId.slice(-6)}
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 text-xs">{inv.createdDate}</td>
                      <td className="px-5 py-3.5 text-gray-600">₹{inv.totalAmount.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-gray-600">₹{inv.tax.toLocaleString()}</td>
                      <td className="px-5 py-3.5 font-semibold text-gray-800">
                        ₹{inv.totalPayable.toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${statusConfig[inv.status].bg}`}>
                          <StatusIcon className="h-3 w-3" />
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleDownloadPdf(inv.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600 transition hover:bg-indigo-100"
                          title="Download PDF"
                        >
                          <Download className="h-3 w-3" />
                          PDF
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Expanded Invoice Details */}
        {expandedId && (
          <div className="border-t border-gray-100 bg-gray-50/50 p-5">
            {(() => {
              const inv = invoices.find((i) => i.id === expandedId);
              if (!inv) return null;
              return (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-800">
                      <FileText className="inline-block h-4 w-4 mr-1 text-indigo-500" />
                      Invoice #{inv.id.slice(-6)} — Items
                    </h4>
                    <button onClick={() => setExpandedId(null)} className="text-xs text-gray-400 hover:text-gray-600">
                      Close
                    </button>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs font-medium text-gray-500">
                        <th className="pb-2">Product</th>
                        <th className="pb-2">Qty</th>
                        <th className="pb-2">Price</th>
                        <th className="pb-2 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {inv.items?.map((item, i) => (
                        <tr key={i}>
                          <td className="py-2 text-gray-700">{item.productName}</td>
                          <td className="py-2 text-gray-600">{item.quantity}</td>
                          <td className="py-2 text-gray-600">₹{item.price.toLocaleString()}</td>
                          <td className="py-2 text-right font-medium text-gray-800">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t border-gray-200">
                      <tr>
                        <td colSpan={3} className="py-2 text-right text-xs font-medium text-gray-500">Subtotal</td>
                        <td className="py-2 text-right font-medium text-gray-700">₹{inv.totalAmount.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="py-1 text-right text-xs font-medium text-gray-500">Tax (GST)</td>
                        <td className="py-1 text-right font-medium text-gray-700">₹{inv.tax.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="py-2 text-right text-sm font-bold text-gray-800">Total Payable</td>
                        <td className="py-2 text-right text-sm font-bold text-indigo-600">₹{inv.totalPayable.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Generate Invoice Modal */}
      {showGenerate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Generate Invoice</h3>
              <button onClick={() => setShowGenerate(false)} className="rounded-lg p-1.5 transition hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="mb-5">
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Select Approved Sales Order
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-lg border border-gray-200 px-3 py-2.5 pr-10 text-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  value={selectedSO}
                  onChange={(e) => setSelectedSO(e.target.value)}
                >
                  <option value="">Select an approved order</option>
                  {availableOrders.map((so) => (
                    <option key={so.id} value={so.id}>
                      SO-{so.id.slice(-6)} — {getCustomerName(so.customerId)} — ₹{so.totalAmount.toLocaleString()}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
              {availableOrders.length === 0 && (
                <p className="mt-2 text-xs text-amber-600">
                  No approved sales orders available. Approve a pending order first.
                </p>
              )}
            </div>

            {selectedSO && (() => {
              const so = salesOrders.find((s) => s.id === selectedSO);
              if (!so) return null;
              return (
                <div className="mb-5 rounded-lg bg-rose-50 p-4 space-y-1">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Customer:</span> {getCustomerName(so.customerId)}
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Items:</span> {so.items?.length ?? 0}
                  </p>
                  <p className="text-sm font-semibold text-rose-700">
                    Amount: ₹{so.totalAmount.toLocaleString()}
                  </p>
                </div>
              );
            })()}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowGenerate(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating || !selectedSO}
                className="rounded-lg bg-gradient-to-r from-rose-600 to-pink-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:shadow-md disabled:opacity-50"
              >
                {generating ? "Generating..." : "Generate Invoice"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
