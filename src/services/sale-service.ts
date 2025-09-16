import type { Sale, CreateSaleData, UpdateSaleData, SaleFilters } from '@/types/sale';

const getApiBase = (organizationId: string) => `/api/organization/${organizationId}/sales`;

export const saleService = {
  getSales: async (organizationId: string, filters: Partial<SaleFilters> = {}): Promise<Sale[]> => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.storeId) params.append('storeId', filters.storeId);
    if (filters.customerId) params.append('customerId', filters.customerId);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await fetch(`${getApiBase(organizationId)}?${params}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la récupération des ventes');
    }
    return response.json();
  },

  getSale: async (organizationId: string, id: string): Promise<Sale> => {
    const response = await fetch(`${getApiBase(organizationId)}/${id}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la récupération de la vente');
    }
    return response.json();
  },

  createSale: async (organizationId: string, data: CreateSaleData): Promise<Sale> => {
    const response = await fetch(getApiBase(organizationId), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la création de la vente');
    }
    return response.json();
  },

  updateSale: async (organizationId: string, id: string, data: UpdateSaleData): Promise<Sale> => {
    const response = await fetch(`${getApiBase(organizationId)}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la modification de la vente');
    }
    return response.json();
  },

  deleteSale: async (organizationId: string, id: string): Promise<void> => {
    const response = await fetch(`${getApiBase(organizationId)}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la suppression de la vente');
    }
  },
};