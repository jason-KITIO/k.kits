export interface EmployeeStock {
  id: string;
  productId: string;
  userId: string;
  quantity: number;
  reservedQty: number;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: string;
    name: string;
    sku: string;
    unit: string;
    minStock: number;
  };
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
}

export interface StockRequest {
  id: string;
  productId: string;
  userId: string;
  requestType: "IN" | "OUT" | "TRANSFER";
  quantity: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  reason?: string;
  notes?: string;
  requestedAt: string;
  approvedAt?: string;
  completedAt?: string;
  product?: {
    id: string;
    name: string;
    sku: string;
  };
}

export interface StockAdjustment {
  id: string;
  productId: string;
  userId: string;
  oldQuantity: number;
  newQuantity: number;
  difference: number;
  reason: string;
  notes?: string;
  adjustedBy: string;
  adjustedAt: string;
  product?: {
    id: string;
    name: string;
    sku: string;
  };
}

export interface CreateStockRequestData {
  productId: string;
  requestType: "IN" | "OUT" | "TRANSFER";
  quantity: number;
  reason?: string;
  notes?: string;
}

export interface CreateAdjustmentData {
  productId: string;
  newQuantity: number;
  reason: string;
  notes?: string;
}
