import type { Stock, StockMovement, CreateStockAdjustmentData, StockTransferData, StockFilters } from '@/types/stock';

const getApiBase = (organizationId: string) => `/api/organization/${organizationId}/stock`;

export const stockService = {
  getStock: async (organizationId: string, filters: Partial<StockFilters> = {}): Promise<Stock[]> => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.storeId) params.append('storeId', filters.storeId);
    if (filters.warehouseId) params.append('warehouseId', filters.warehouseId);
    if (filters.lowStock !== undefined) params.append('lowStock', filters.lowStock.toString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await fetch(`${getApiBase(organizationId)}?${params}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la récupération du stock');
    }
    return response.json();
  },

  getStockMovements: async (organizationId: string, filters: Partial<StockFilters> = {}): Promise<StockMovement[]> => {
    const params = new URLSearchParams();
    
    if (filters.productId) params.append('productId', filters.productId);
    if (filters.storeId) params.append('storeId', filters.storeId);
    if (filters.warehouseId) params.append('warehouseId', filters.warehouseId);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await fetch(`${getApiBase(organizationId)}/movements?${params}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la récupération des mouvements de stock');
    }
    return response.json();
  },

  createStockAdjustment: async (organizationId: string, data: CreateStockAdjustmentData): Promise<StockMovement> => {
    const response = await fetch(`${getApiBase(organizationId)}/adjustments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de l\'ajustement du stock');
    }
    return response.json();
  },

  createStockTransfer: async (organizationId: string, data: StockTransferData): Promise<StockMovement> => {
    const response = await fetch(`${getApiBase(organizationId)}/transfers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors du transfert de stock');
    }
    return response.json();
  },
};