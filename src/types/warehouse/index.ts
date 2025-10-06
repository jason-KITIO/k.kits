export type Warehouse = {
  id: string;
  name: string;
  type: "MAIN" | "SECONDARY" | "TRANSIT" | "RETURNS";
  address?: string;
  phone?: string;
  capacity?: number;
  active: boolean;
  managerId?: string;
  manager?: {
    firstName: string;
    lastName: string;
  };
};

export type StockItem = {
  id: string;
  quantity: number;
  reservedQuantity: number;
  product: {
    id: string;
    name: string;
    sku: string;
    unitPrice: number;
  };
};

export type StockMovement = {
  id: string;
  type: string;
  quantity: number;
  createdAt: string;
  reference?: string;
  product: {
    name: string;
    sku: string;
  };
  user: {
    firstName: string;
    lastName: string;
  };
};

export type PurchaseOrder = {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  orderNumber: string;
  expectedDate?: string;
  supplier: {
    name: string;
  };
};

export type StockMovementRequest = {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  quantity: number;
  reason?: string;
  createdAt: string;
  fromType: string;
  toType: string;
  fromId: string;
  toId: string;
  product: {
    id: string;
    name: string;
    sku: string;
  };
  requester: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  approver?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

export type PurchaseOrderCreateData = {
  supplierId: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
};

export type StockAdjustmentData = {
  productId: string;
  quantity: number;
  reason: string;
  notes?: string;
};

export type StockTransferData = {
  fromWarehouseId: string;
  toWarehouseId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  reason?: string;
};
