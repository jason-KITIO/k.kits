import { api } from './api';
import type { 
  SaleCreateInput, 
  NotificationCreateInput,
  StockTransferCreateInput 
} from '@/schema';

export interface DashboardData {
  overview: {
    totalProducts: number;
    totalStores: number;
    totalWarehouses: number;
    lowStockProducts: number;
  };
  sales: {
    todayAmount: number;
    todayCount: number;
  };
  orders: {
    pending: number;
  };
  stock: {
    totalValue: number;
    lowStockAlert: number;
  };
  recentActivity: any[];
}

export interface Sale {
  id: string;
  customerId?: string;
  storeId: string;
  totalAmount: number;
  paidAmount: number;
  status: 'PENDING' | 'PAID' | 'PARTIAL' | 'CANCELLED' | 'REFUNDED';
  saleDate: string;
  dueDate?: string;
  userId: string;
  organizationId: string;
  createdAt: string;
  customer?: { name: string };
  store: { name: string };
  user: { firstName: string; lastName: string };
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    totalAmount: number;
    product: { name: string; sku: string };
  }>;
}

export interface Notification {
  id: string;
  userId: string;
  organizationId: string;
  type: 'STOCK_LOW' | 'SALE_COMPLETED' | 'ORDER_RECEIVED' | 'SYSTEM_UPDATE';
  title: string;
  message: string;
  read: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  createdAt: string;
}

export interface StockAlert {
  id: string;
  productId: string;
  quantity: number;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  percentageLeft: number;
  product: {
    name: string;
    sku: string;
    minStock: number;
    unitPrice: number;
  };
  store?: { name: string };
  warehouse?: { name: string };
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  lastSignInAt?: string;
  createdAt: string;
}

export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  joinedAt: string;
  active: boolean;
  user: User;
  role: {
    id: string;
    name: string;
    color?: string;
  };
}

export const organizationService = {
  getDashboard: (organizationId: string): Promise<DashboardData> =>
    api.get(`/api/organization/${organizationId}/dashboard`),

  getSales: (organizationId: string, params?: { storeId?: string; startDate?: string; endDate?: string }): Promise<Sale[]> => {
    const searchParams = new URLSearchParams();
    if (params?.storeId) searchParams.set('storeId', params.storeId);
    if (params?.startDate) searchParams.set('startDate', params.startDate);
    if (params?.endDate) searchParams.set('endDate', params.endDate);
    
    return api.get(`/api/organization/${organizationId}/sales?${searchParams}`);
  },

  getNotifications: (organizationId: string): Promise<Notification[]> =>
    api.get(`/api/organization/${organizationId}/notifications`),

  createNotification: (organizationId: string, data: NotificationCreateInput): Promise<Notification> =>
    api.post(`/api/organization/${organizationId}/notifications`, data),

  markNotificationsRead: (organizationId: string, data: { notificationIds?: string[]; markAllAsRead?: boolean }) =>
    api.post(`/api/organization/${organizationId}/notifications/mark-read`, data),

  getStockAlerts: (organizationId: string): Promise<StockAlert[]> =>
    api.get(`/api/organization/${organizationId}/stock-alerts`),

  getStockTransfers: (organizationId: string) =>
    api.get(`/api/organization/${organizationId}/stock-transfers`),

  createStockTransfer: (organizationId: string, data: StockTransferCreateInput) =>
    api.post(`/api/organization/${organizationId}/stock-transfers`, data),

  getUsers: (organizationId: string): Promise<OrganizationMember[]> =>
    api.get(`/api/organization/${organizationId}/users`),

  search: (organizationId: string, query: string, type: 'products' | 'customers' | 'suppliers') =>
    api.get(`/api/organization/${organizationId}/search?q=${query}&type=${type}`),

  getReports: (organizationId: string, type: 'sales' | 'stock' | 'movements' | 'profit', params?: { startDate?: string; endDate?: string }) => {
    const searchParams = new URLSearchParams({ type });
    if (params?.startDate) searchParams.set('startDate', params.startDate);
    if (params?.endDate) searchParams.set('endDate', params.endDate);
    
    return api.get(`/api/organization/${organizationId}/reports?${searchParams}`);
  },

  getSettings: (organizationId: string) =>
    api.get(`/api/organization/${organizationId}/settings`),

  updateSettings: (organizationId: string, data: any) =>
    api.put(`/api/organization/${organizationId}/settings`, data),
};