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
