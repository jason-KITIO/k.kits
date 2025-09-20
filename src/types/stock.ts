export interface Stock {
  id: string;
  productId: string;
  quantity: number;
  reservedQuantity: number;
  lastUpdated: string;
  product: {
    id: string;
    sku: string;
    name: string;
    unitPrice: number;
    minStock: number;
  };
}