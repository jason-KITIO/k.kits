import { api } from './api';
import type { SaleCreateInput } from '@/schema/sale.schema';
import type { StockMovementAdjustmentInput } from '@/schema';
import type { StoreCreateInput, StoreUpdateInput } from '@/schema/store-schema';
import type { Store } from '@/types/store';
import type { Stock } from '@/types/stock';
import type { Customer } from '@/types/customer';

type Product = {
  id: string;
  sku: string;
  name: string;
  description?: string;
  unitPrice: number;
  costPrice: number;
  minStock: number;
  active: boolean;
};

type StockMovement = {
  id: string;
  productId: string;
  quantity: number;
  type: string;
  reason?: string;
  createdAt: string;
};

type Category = {
  id: string;
  name: string;
  description?: string;
};

type Supplier = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
};

type StoreFilters = {
  search?: string;
  type?: "PHYSICAL" | "ONLINE" | "HYBRID";
  active?: boolean;
  page?: number;
  limit?: number;
};

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
    recentSales: unknown[];
    topProducts: unknown[];
  };
}

export const storeService = {
  // Gestion des boutiques
  getStores: async (organizationId: string, filters: Partial<StoreFilters> = {}): Promise<Store[]> => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.type) params.append('type', filters.type);
    if (filters.active !== undefined) params.append('active', filters.active.toString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    return api.get(`/organization/${organizationId}/stores?${params}`);
  },

  getStore: (organizationId: string, storeId: string): Promise<Store> =>
    api.get(`/organization/${organizationId}/stores/${storeId}`),

  createStore: (organizationId: string, data: StoreCreateInput): Promise<Store> =>
    api.post(`/organization/${organizationId}/stores`, data),

  updateStore: (organizationId: string, storeId: string, data: StoreUpdateInput): Promise<Store> =>
    api.put(`/organization/${organizationId}/stores/${storeId}`, data),

  deleteStore: (organizationId: string, storeId: string): Promise<void> =>
    api.delete(`/organization/${organizationId}/stores/${storeId}`),

  // Dashboard
  getDashboard: (organizationId: string, storeId: string): Promise<StoreDashboard> =>
    api.get(`/organization/${organizationId}/stores/${storeId}/dashboard`),

  // Produits
  getProducts: (organizationId: string, storeId: string): Promise<Product[]> =>
    api.get(`/organization/${organizationId}/stores/${storeId}/products`),

  getProduct: (organizationId: string, storeId: string, productId: string): Promise<Product> =>
    api.get(`/organization/${organizationId}/stores/${storeId}/products/${productId}`),

  createProduct: (organizationId: string, storeId: string, data: Partial<Product>): Promise<Product> =>
    api.post(`/organization/${organizationId}/stores/${storeId}/products`, data),

  searchProductByBarcode: (organizationId: string, storeId: string, code: string): Promise<Product> =>
    api.get(`/organization/${organizationId}/stores/${storeId}/products/barcode?code=${code}`),

  // Stock
  getStock: (organizationId: string, storeId: string): Promise<Stock[]> =>
    api.get(`/organization/${organizationId}/stores/${storeId}/stock`),

  getStockMovements: (organizationId: string, storeId: string): Promise<StockMovement[]> =>
    api.get(`/organization/${organizationId}/stores/${storeId}/stock-movements`),

  createStockAdjustment: (organizationId: string, storeId: string, data: StockMovementAdjustmentInput) =>
    api.post(`/organization/${organizationId}/stores/${storeId}/stock-adjustments`, data),

  // Ventes
  getSales: (organizationId: string, storeId: string) =>
    api.get(`/organization/${organizationId}/stores/${storeId}/sales`),

  createSale: (organizationId: string, storeId: string, data: SaleCreateInput) =>
    api.post(`/organization/${organizationId}/stores/${storeId}/sales`, data),

  getSale: (organizationId: string, storeId: string, saleId: string) =>
    api.get(`/organization/${organizationId}/stores/${storeId}/sales/${saleId}`),

  // Clients
  getCustomers: (organizationId: string, storeId: string): Promise<Customer[]> =>
    api.get(`/organization/${organizationId}/stores/${storeId}/customer`),

  getCustomer: (organizationId: string, storeId: string, customerId: string): Promise<Customer> =>
    api.get(`/organization/${organizationId}/stores/${storeId}/customer/${customerId}`),

  createCustomer: (organizationId: string, storeId: string, data: Partial<Customer>): Promise<Customer> =>
    api.post(`/organization/${organizationId}/stores/${storeId}/customer`, data),

  updateCustomer: (organizationId: string, storeId: string, customerId: string, data: Partial<Customer>): Promise<void> =>
    api.put(`/organization/${organizationId}/stores/${storeId}/customer/${customerId}`, data),

  deleteCustomer: (organizationId: string, storeId: string, customerId: string): Promise<void> =>
    api.delete(`/organization/${organizationId}/stores/${storeId}/customer/${customerId}`),

  // Catégories
  getCategories: (organizationId: string, storeId: string): Promise<Category[]> =>
    api.get(`/organization/${organizationId}/stores/${storeId}/categories`),

  // Fournisseurs
  getSuppliers: (organizationId: string, storeId: string): Promise<Supplier[]> =>
    api.get(`/organization/${organizationId}/stores/${storeId}/suppliers`),

  createSupplier: (organizationId: string, storeId: string, data: Partial<Supplier>): Promise<Supplier> =>
    api.post(`/organization/${organizationId}/stores/${storeId}/suppliers`, data),
};