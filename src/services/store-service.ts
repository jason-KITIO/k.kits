import { api } from './api';
import type { SaleCreateInput, StockAdjustmentInput } from '@/schema';

export interface Store {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  managerId?: string;
  type: 'PHYSICAL' | 'ONLINE' | 'HYBRID';
  organizationId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  manager?: {
    firstName?: string;
    lastName?: string;
  };
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  categoryId?: string;
  supplierId?: string;
  color: string;
  unitPrice: number;
  costPrice: number;
  weight?: number;
  dimensions?: string;
  minStock: number;
  maxStock?: number;
  organizationId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  category?: { name: string };
  supplier?: { name: string };
  stocks?: Array<{
    quantity: number;
    store?: { name: string };
    warehouse?: { name: string };
  }>;
}

export interface Stock {
  id: string;
  productId: string;
  warehouseId?: string;
  storeId?: string;
  quantity: number;
  reservedQuantity: number;
  organizationId: string;
  lastUpdated: string;
  product: {
    name: string;
    sku: string;
    unitPrice: number;
    minStock: number;
    category?: { name: string };
    supplier?: { name: string };
  };
  warehouse?: { name: string };
}

export interface StockMovement {
  id: string;
  productId: string;
  fromWarehouseId?: string;
  toWarehouseId?: string;
  fromStoreId?: string;
  toStoreId?: string;
  quantity: number;
  type: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT' | 'SALE' | 'PURCHASE';
  reference?: string;
  reason?: string;
  userId: string;
  organizationId: string;
  createdAt: string;
  product: { name: string };
  user: { firstName?: string; lastName?: string };
  fromStore?: { name: string };
  toStore?: { name: string };
  fromWarehouse?: { name: string };
  toWarehouse?: { name: string };
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  type: 'INDIVIDUAL' | 'COMPANY' | 'VIP';
  organizationId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  organizationId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  parent?: { name: string };
  subCategories?: Category[];
}

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  taxNumber?: string;
  paymentTerms?: string;
  notes?: string;
  organizationId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StoreDashboard {
  sales: {
    todayAmount: number;
    todayCount: number;
  };
  inventory: {
    totalProducts: number;
    lowStockCount: number;
    totalValue: number;
  };
  recentActivity: {
    recentSales: any[];
    topProducts: any[];
  };
}

export const storeService = {
  getStores: (organizationId: string): Promise<Store[]> =>
    api.get(`/api/organization/${organizationId}/stores`),

  getStore: (organizationId: string, storeId: string): Promise<Store> =>
    api.get(`/api/organization/${organizationId}/stores/${storeId}`),

  getDashboard: (organizationId: string, storeId: string): Promise<StoreDashboard> =>
    api.get(`/api/organization/${organizationId}/stores/${storeId}/dashboard`),

  getProducts: (organizationId: string, storeId: string): Promise<Product[]> =>
    api.get(`/api/organization/${organizationId}/stores/${storeId}/products`),

  getProduct: (organizationId: string, storeId: string, productId: string): Promise<Product> =>
    api.get(`/api/organization/${organizationId}/stores/${storeId}/products/${productId}`),

  searchProductByBarcode: (organizationId: string, storeId: string, code: string): Promise<Product> =>
    api.get(`/api/organization/${organizationId}/stores/${storeId}/products/barcode?code=${code}`),

  getStock: (organizationId: string, storeId: string): Promise<Stock[]> =>
    api.get(`/api/organization/${organizationId}/stores/${storeId}/stock`),

  getStockMovements: (organizationId: string, storeId: string): Promise<StockMovement[]> =>
    api.get(`/api/organization/${organizationId}/stores/${storeId}/stock-movements`),

  createStockAdjustment: (organizationId: string, storeId: string, data: StockAdjustmentInput) =>
    api.post(`/api/organization/${organizationId}/stores/${storeId}/stock-adjustments`, data),

  getSales: (organizationId: string, storeId: string) =>
    api.get(`/api/organization/${organizationId}/stores/${storeId}/sales`),

  createSale: (organizationId: string, storeId: string, data: SaleCreateInput) =>
    api.post(`/api/organization/${organizationId}/stores/${storeId}/sales`, data),

  getSale: (organizationId: string, storeId: string, saleId: string) =>
    api.get(`/api/organization/${organizationId}/stores/${storeId}/sales/${saleId}`),

  getCustomers: (organizationId: string, storeId: string): Promise<Customer[]> =>
    api.get(`/api/organization/${organizationId}/stores/${storeId}/customer`),

  getCategories: (organizationId: string, storeId: string): Promise<Category[]> =>
    api.get(`/api/organization/${organizationId}/stores/${storeId}/categories`),

  getSuppliers: (organizationId: string, storeId: string): Promise<Supplier[]> =>
    api.get(`/api/organization/${organizationId}/stores/${storeId}/suppliers`),

  createStore: (organizationId: string, data: Partial<Store>): Promise<Store> =>
    api.post(`/api/organization/${organizationId}/stores`, data),

  createCustomer: (organizationId: string, storeId: string, data: Partial<Customer>): Promise<Customer> =>
    api.post(`/api/organization/${organizationId}/stores/${storeId}/customer`, data),

  createProduct: (organizationId: string, storeId: string, data: Partial<Product>): Promise<Product> =>
    api.post(`/api/organization/${organizationId}/stores/${storeId}/products`, data),

  createSupplier: (organizationId: string, storeId: string, data: Partial<Supplier>): Promise<Supplier> =>
    api.post(`/api/organization/${organizationId}/stores/${storeId}/suppliers`, data),
};