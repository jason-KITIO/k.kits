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

export interface WarehouseFilters {
  type?: 'MAIN' | 'SECONDARY' | 'TRANSIT' | 'RETURNS';
  active?: boolean;
  managerId?: string;
}

export interface CreateWarehouseData {
  name: string;
  address?: string;
  phone?: string;
  managerId?: string;
  capacity?: number;
  type?: 'MAIN' | 'SECONDARY' | 'TRANSIT' | 'RETURNS';
  active?: boolean;
}

export interface UpdateWarehouseData {
  name?: string;
  address?: string;
  phone?: string;
  managerId?: string;
  capacity?: number;
  type?: 'MAIN' | 'SECONDARY' | 'TRANSIT' | 'RETURNS';
  active?: boolean;
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