export interface StockInventory {
  id: string;
  productId: string;
  warehouseId?: string;
  userId?: string;
  expectedQty: number;
  actualQty: number;
  difference: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  notes?: string;
  performedBy: string;
  scheduledDate: string;
  completedAt?: string;
  createdAt: string;
  product?: {
    id: string;
    name: string;
    sku: string;
  };
  warehouse?: {
    id: string;
    name: string;
  };
  performer?: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface CreateInventoryData {
  productId: string;
  warehouseId?: string;
  userId?: string;
  expectedQty: number;
  scheduledDate: string;
  notes?: string;
}

export interface UpdateInventoryData {
  actualQty: number;
  notes?: string;
}
