import { api } from './api';
import type { 
  WarehouseCreateInput, 
  WarehouseUpdateInput,
  StockAdjustmentInput,
  PurchaseOrderCreateInput,
  PurchaseOrderUpdateInput
} from '@/schema';

export interface Warehouse {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  managerId?: string;
  capacity?: number;
  type: 'MAIN' | 'SECONDARY' | 'TRANSIT' | 'RETURNS';
  organizationId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  manager?: {
    firstName?: string;
    lastName?: string;
  };
}

export interface WarehouseStock {
  id: string;
  productId: string;
  warehouseId: string;
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
}

export interface WarehouseStockMovement {
  id: string;
  productId: string;
  fromWarehouseId?: string;
  toWarehouseId?: string;
  quantity: number;
  type: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT' | 'PURCHASE';
  reference?: string;
  reason?: string;
  userId: string;
  organizationId: string;
  createdAt: string;
  product: { name: string };
  user: { firstName?: string; lastName?: string };
  fromWarehouse?: { name: string };
  toWarehouse?: { name: string };
}

export interface WarehousePurchaseOrder {
  id: string;
  supplierId: string;
  warehouseId: string;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'RECEIVED' | 'CANCELLED';
  totalAmount: number;
  expectedDate?: string;
  receivedDate?: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  supplier: { name: string };
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    receivedQuantity: number;
    product: { name: string; sku: string };
  }>;
}

export const warehouseService = {
  getWarehouses: (organizationId: string): Promise<Warehouse[]> =>
    api.get(`/api/organization/${organizationId}/warehouses`),

  getWarehouse: (organizationId: string, warehouseId: string): Promise<Warehouse> =>
    api.get(`/api/organization/${organizationId}/warehouses/${warehouseId}`),

  createWarehouse: (organizationId: string, data: WarehouseCreateInput): Promise<Warehouse> =>
    api.post(`/api/organization/${organizationId}/warehouses`, data),

  updateWarehouse: (organizationId: string, warehouseId: string, data: WarehouseUpdateInput): Promise<Warehouse> =>
    api.put(`/api/organization/${organizationId}/warehouses/${warehouseId}`, data),

  deleteWarehouse: (organizationId: string, warehouseId: string): Promise<void> =>
    api.delete(`/api/organization/${organizationId}/warehouses/${warehouseId}`),

  getStock: (organizationId: string, warehouseId: string): Promise<WarehouseStock[]> =>
    api.get(`/api/organization/${organizationId}/warehouses/${warehouseId}/stock`),

  createStockAdjustment: (organizationId: string, warehouseId: string, data: StockAdjustmentInput) =>
    api.post(`/api/organization/${organizationId}/warehouses/${warehouseId}/stock-adjustments`, data),

  getStockMovements: (organizationId: string, warehouseId: string): Promise<WarehouseStockMovement[]> =>
    api.get(`/api/organization/${organizationId}/warehouses/${warehouseId}/stock-movements`),

  getPurchaseOrders: (organizationId: string, warehouseId: string): Promise<WarehousePurchaseOrder[]> =>
    api.get(`/api/organization/${organizationId}/warehouses/${warehouseId}/purchase-orders`),

  getPurchaseOrder: (organizationId: string, warehouseId: string, orderId: string): Promise<WarehousePurchaseOrder> =>
    api.get(`/api/organization/${organizationId}/warehouses/${warehouseId}/purchase-orders/${orderId}`),

  createPurchaseOrder: (organizationId: string, warehouseId: string, data: PurchaseOrderCreateInput): Promise<WarehousePurchaseOrder> =>
    api.post(`/api/organization/${organizationId}/warehouses/${warehouseId}/purchase-orders`, data),

  updatePurchaseOrder: (organizationId: string, warehouseId: string, orderId: string, data: PurchaseOrderUpdateInput): Promise<WarehousePurchaseOrder> =>
    api.put(`/api/organization/${organizationId}/warehouses/${warehouseId}/purchase-orders/${orderId}`, data),
};