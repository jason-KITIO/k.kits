export interface StockReport {
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  minStock: number;
  maxStock?: number;
  stockValue: number;
  unitPrice: number;
  warehouseName?: string;
  lastMovement?: string;
}

export interface MovementReport {
  id: string;
  productName: string;
  sku: string;
  movementType: "IN" | "OUT" | "TRANSFER" | "ADJUSTMENT";
  quantity: number;
  previousQty: number;
  newQty: number;
  reason?: string;
  performedBy: string;
  performedAt: string;
  warehouseName?: string;
}

export interface PerformanceReport {
  totalProducts: number;
  totalStockValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  overstockItems: number;
  totalMovements: number;
  topProducts: {
    productName: string;
    sku: string;
    totalMovements: number;
    stockValue: number;
  }[];
  monthlyTrends: {
    month: string;
    stockIn: number;
    stockOut: number;
    adjustments: number;
  }[];
}

export interface ExportData {
  type: "STOCK" | "MOVEMENTS" | "PERFORMANCE";
  format: "CSV" | "EXCEL" | "PDF";
  dateFrom?: string;
  dateTo?: string;
  warehouseId?: string;
}
