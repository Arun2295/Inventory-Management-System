import axios from "axios";

axios.defaults.withCredentials = true;

// ── Product Types ──
export interface Product {
  id: string;
  productname: string;
  sku: string;
  category: string;
  price: number;
  currentstock: number;
  reorderlevel: number;
}

export interface ProductRequest {
  productname: string;
  sku: string;
  category: string;
  price: number;
  currentstock: number;
  reorderlevel: number;
}

// ── Customer Types ──
export interface Customer {
  id: string;
  name: string;
  email: string;
  number: number;
  address: string;
}

export interface CustomerRequest {
  name: string;
  email: string;
  number: number;
  address: string;
}

// ── Supplier Types ──
export interface Supplier {
  id: string;
  name: string;
  email: string;
  number: number;
  address: string;
}

export interface SupplierRequest {
  name: string;
  email: string;
  number: number;
  address: string;
}

// ── Sales Order Types ──
export type OrderStatus = "PENDING" | "APPROVED" | "DISPATCHED";

export interface SalesOrderItem {
  productid: string;
  productname: string;
  price: number;
  quantity: number;
}

export interface SalesOrder {
  id: string;
  customerId: string;
  orderDate: string;
  status: OrderStatus;
  totalAmount: number;
  items: SalesOrderItem[];
}

export interface SalesOrderRequest {
  customerId: string;
  items: { productid: string; quantity: number }[];
}

// ── Purchase Order Types ──
export type PurchaseOrderStatus = "ORDERED" | "RECEIVED";

export interface PurchaseOrderItem {
  productId: string;
  quantity: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  items: PurchaseOrderItem[];
  expectedDeliveryDate: string;
  status: PurchaseOrderStatus;
}

export interface PurchaseOrderRequest {
  supplierId: string;
  items: { productId: string; quantity: number }[];
  expectedDeliveryDate: string;
}

// ── GRN Types ──
export interface GrnItem {
  productId: string;
  quantity: number;
}

export interface GrnResponse {
  id: string;
  purchaseOrderId: string;
  receivedDate: string;
  items: GrnItem[];
}

export interface GrnRequest {
  purchaseOrderId: string;
  items: { productId: string; quantity: number }[];
}

// ── Invoice Types ──
export type InvoiceStatus = "PAID" | "UNPAID";

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface InvoiceResponse {
  id: string;
  salesOrderId: string;
  customerId: string;
  items: InvoiceItem[];
  totalAmount: number;
  tax: number;
  totalPayable: number;
  status: InvoiceStatus;
  createdDate: string;
}

// ── Dashboard Types ──
export interface TopProduct {
  productId: string;
  productName: string;
  quantity: number;
}

export interface SalesSummary {
  totalSales: number;
  totalOrders: number;
  topProducts: TopProduct[];
  pendingInvoices: number;
}

export interface PurchaseSummary {
  totalOrders: number;
  receivedOrders: number;
}

export interface StockAlert {
  productId: string;
  productName: string;
  currentStock: number;
  reorderLevel: number;
}

// ── Product API ──
export const productApi = {
  getAll: () => axios.get<Product[]>("/products/all").then((r) => r.data),
  create: (data: ProductRequest) =>
    axios.post<Product>("/products/create", data).then((r) => r.data),
  update: (id: string, data: ProductRequest) =>
    axios.put<Product>(`/products/update/${id}`, data).then((r) => r.data),
  delete: (id: string) =>
    axios.delete<Product>(`/products/delete/${id}`).then((r) => r.data),
};

// ── Customer API ──
export const customerApi = {
  getAll: () => axios.get<Customer[]>("/customer/all").then((r) => r.data),
  create: (data: CustomerRequest) =>
    axios.post<Customer>("/customer/create", data).then((r) => r.data),
};

// ── Supplier API ──
export const supplierApi = {
  getAll: () => axios.get<Supplier[]>("/supplier/all").then((r) => r.data),
  create: (data: SupplierRequest) =>
    axios.post<Supplier>("/supplier/create", data).then((r) => r.data),
};

// ── Sales Order API ──
export const salesOrderApi = {
  getAll: () =>
    axios.get<SalesOrder[]>("/api/sales-order").then((r) => r.data),
  create: (data: SalesOrderRequest) =>
    axios.post<SalesOrder>("/api/sales-order", data).then((r) => r.data),
  updateStatus: (id: string, status: OrderStatus) =>
    axios
      .put<SalesOrder>(`/api/sales-order/${id}/status?status=${status}`)
      .then((r) => r.data),
};

// ── Purchase Order API ──
export const purchaseOrderApi = {
  getAll: () =>
    axios.get<PurchaseOrder[]>("/api/purchase-order").then((r) => r.data),
  create: (data: PurchaseOrderRequest) =>
    axios.post<PurchaseOrder>("/api/purchase-order", data).then((r) => r.data),
  updateStatus: (id: string, status: PurchaseOrderStatus) =>
    axios
      .put<PurchaseOrder>(
        `/api/purchase-order/${id}/status?status=${status}`
      )
      .then((r) => r.data),
};

// ── GRN API ──
export const grnApi = {
  getAll: () => axios.get<GrnResponse[]>("/grn").then((r) => r.data),
  create: (data: GrnRequest) =>
    axios.post<GrnResponse>("/grn", data).then((r) => r.data),
};

// ── Invoice API ──
export const invoiceApi = {
  getAll: () =>
    axios.get<InvoiceResponse[]>("/invoices").then((r) => r.data),
  generate: (salesOrderId: string) =>
    axios
      .post<InvoiceResponse>(`/invoices/${salesOrderId}`)
      .then((r) => r.data),
  downloadPdf: (id: string) =>
    axios
      .get(`/invoices/${id}/pdf`, { responseType: "blob" })
      .then((r) => r.data),
};

// ── Dashboard API ──
export const dashboardApi = {
  getSalesSummary: () =>
    axios
      .get<SalesSummary>("/api/dashboard/sales-summary")
      .then((r) => r.data),
  getPurchaseSummary: () =>
    axios
      .get<PurchaseSummary>("/api/dashboard/purchase-summary")
      .then((r) => r.data),
  getStockAlerts: () =>
    axios
      .get<StockAlert[]>("/api/dashboard/stock-alert")
      .then((r) => r.data),
};
