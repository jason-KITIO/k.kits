export interface ProductFormData {
  sku: string;
  name: string;
  color?: string;
  description?: string;
  categoryId?: string;
  supplierId?: string;
  unitPrice: number;
  costPrice: number;
  weight?: number;
  dimensions?: string;
  minStock?: number;
  maxStock?: number;
  active?: boolean;
}