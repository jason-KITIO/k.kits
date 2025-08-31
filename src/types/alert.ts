export interface StockAlert {
  id: string;
  productId: string;
  warehouseId?: string;
  userId?: string;
  alertType: "LOW_STOCK" | "OUT_OF_STOCK" | "OVERSTOCK";
  currentQty: number;
  thresholdQty: number;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED";
  message: string;
  createdAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  product?: {
    id: string;
    name: string;
    sku: string;
    minStock: number;
    maxStock?: number;
  };
  warehouse?: {
    id: string;
    name: string;
  };
}

export interface Notification {
  id: string;
  userId: string;
  organizationId: string;
  type: "STOCK_ALERT" | "TRANSFER" | "INVENTORY" | "PURCHASE_ORDER";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  relatedId?: string;
}
