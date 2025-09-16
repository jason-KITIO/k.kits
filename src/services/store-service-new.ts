import type { Store, CreateStoreData, UpdateStoreData, StoreFilters } from '@/types/store';

const getApiBase = (organizationId: string) => `/api/organization/${organizationId}/stores`;

export const storeService = {
  getStores: async (organizationId: string, filters: Partial<StoreFilters> = {}): Promise<Store[]> => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.type) params.append('type', filters.type);
    if (filters.active !== undefined) params.append('active', filters.active.toString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await fetch(`${getApiBase(organizationId)}?${params}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la récupération des boutiques');
    }
    return response.json();
  },

  getStore: async (organizationId: string, id: string): Promise<Store> => {
    const response = await fetch(`${getApiBase(organizationId)}/${id}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la récupération de la boutique');
    }
    return response.json();
  },

  createStore: async (organizationId: string, data: CreateStoreData): Promise<Store> => {
    const response = await fetch(getApiBase(organizationId), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la création de la boutique');
    }
    return response.json();
  },

  updateStore: async (organizationId: string, id: string, data: UpdateStoreData): Promise<Store> => {
    const response = await fetch(`${getApiBase(organizationId)}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la modification de la boutique');
    }
    return response.json();
  },

  deleteStore: async (organizationId: string, id: string): Promise<void> => {
    const response = await fetch(`${getApiBase(organizationId)}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la suppression de la boutique');
    }
  },
};