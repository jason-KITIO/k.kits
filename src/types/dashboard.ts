export interface LowStockItem {
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    sku: string;
    minStock: number;
  };
}

export interface StockOverviewItem {
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    sku: string;
    unitPrice: number;
  };
}

export interface StockValueResult {
  productId: string;
  quantity: number;
  unitPrice: string;
  totalValue: string;
}

export interface StockValueResponse {
  results: StockValueResult[];
  totalValue: string;
}
