import type { ProductFormData } from '@/types/product';
import type { productCreateInput, productUpdateInput } from '@/schema/product.schema';

type Product = {
  id: string;
  sku: string;
  name: string;
  description?: string;
  categoryId?: string;
  supplierId?: string;
  color: string;
  unitPrice: number;
  costPrice: number;
  weight?: number;
  dimensions?: string;
  minStock: number;
  maxStock?: number;
  organizationId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

type ProductFilters = {
  search?: string;
  categoryId?: string;
  supplierId?: string;
  active?: boolean;
  page?: number;
  limit?: number;
};

const getApiBase = (organizationId: string, storeId?: string) => 
  storeId ? `/api/organization/${organizationId}/stores/${storeId}/products` : `/api/organization/${organizationId}/products`;

export const productService = {
  getProducts: async (organizationId: string, filters: Partial<ProductFilters> = {}, storeId?: string): Promise<Product[]> => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await fetch(`${getApiBase(organizationId, storeId)}?${params}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la récupération des produits');
    }
    return response.json();
  },

  getProduct: async (organizationId: string, id: string, storeId?: string): Promise<Product> => {
    const response = await fetch(`${getApiBase(organizationId, storeId)}/${id}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la récupération du produit');
    }
    return response.json();
  },

  createProduct: async (organizationId: string, data: productCreateInput, storeId?: string): Promise<Product> => {
    const response = await fetch(getApiBase(organizationId, storeId), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la création du produit');
    }
    return response.json();
  },

  updateProduct: async (organizationId: string, id: string, data: productUpdateInput, storeId?: string): Promise<Product> => {
    const response = await fetch(`${getApiBase(organizationId, storeId)}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la modification du produit');
    }
    return response.json();
  },

  deleteProduct: async (organizationId: string, id: string, storeId?: string): Promise<void> => {
    const response = await fetch(`${getApiBase(organizationId, storeId)}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la suppression du produit');
    }
  },
};