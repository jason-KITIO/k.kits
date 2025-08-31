export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  categoryId?: string;
  supplierId?: string;
  organizationId: string;
  unitPrice?: number;
  costPrice?: number;
  minStock: number;
  maxStock?: number;
  unit: string;
  weight?: number;
  dimensions?: string;
  imageUrl?: string;
  color?: string;
  material?: string;
  size?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  sku?: string; // Optionnel car généré automatiquement
  barcode?: string;
  categoryId?: string;
  supplierId?: string;
  unitPrice?: number;
  costPrice?: number;
  minStock?: number;
  maxStock?: number;
  unit?: string;
  weight?: number;
  dimensions?: string;
  imageUrl?: string;
  color?: string;
  material?: string;
  size?: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  active?: boolean;
}
