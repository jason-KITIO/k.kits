export interface StockAlert {
  id: string;
  productId: string;
  quantity: number;
  urgency: "CRITICAL" | "HIGH" | "MEDIUM";
  percentageLeft: number;
  product: {
    name: string;
    sku: string;
    minStock: number;
    unitPrice: number;
  };
  store?: {
    name: string;
  };
  warehouse?: {
    name: string;
  };
}

export type StockAlertUrgency = StockAlert["urgency"];