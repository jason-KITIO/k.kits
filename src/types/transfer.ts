export interface StockTransfer {
  id: string;
  productId: string;
  quantity: number;
  sourceWarehouseId?: string;
  sourceUserId?: string;
  destWarehouseId?: string;
  destUserId?: string;
  status: "PENDING" | "APPROVED" | "COMPLETED" | "CANCELLED";
  notes?: string;
  requestedBy: string;
  approvedBy?: string;
  completedBy?: string;
  requestedAt: string;
  approvedAt?: string;
  completedAt?: string;
  product?: {
    id: string;
    name: string;
    sku: string;
  };
  sourceWarehouse?: {
    id: string;
    name: string;
  };
  destWarehouse?: {
    id: string;
    name: string;
  };
  sourceUser?: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
  destUser?: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
  requester?: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface CreateTransferData {
  productId: string;
  quantity: number;
  sourceWarehouseId?: string;
  sourceUserId?: string;
  destWarehouseId?: string;
  destUserId?: string;
  notes?: string;
}
