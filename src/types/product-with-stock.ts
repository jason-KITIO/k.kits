export interface ProductStock {
  quantity: number;
}

export interface ProductCategory {
  name: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  unitPrice: number;
  minStock: number;
  active: boolean;
  category?: ProductCategory;
  stocks?: ProductStock[];
}