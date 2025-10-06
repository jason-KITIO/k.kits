import { useOptimizedQuery } from '../../use-optimized-query';
import { storeService } from '@/services/store-service';

type StoreFilters = {
  type?: "PHYSICAL" | "ONLINE" | "HYBRID";
  active?: boolean;
  managerId?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export const useStoresWithFilters = (organizationId: string, filters: Partial<StoreFilters> = {}) => {
  return useOptimizedQuery({
    queryKey: ["stores", organizationId, filters],
    queryFn: async () => await storeService.getStores(organizationId, filters),
    enabled: !!organizationId,
  });
};

export const useStoreById = (organizationId: string, storeId: string) => {
  return useOptimizedQuery({
    queryKey: ["store", organizationId, storeId],
    queryFn: async () => await storeService.getStore(organizationId, storeId),
    enabled: !!organizationId && !!storeId,
  });
};

export const useStoreStockById = (organizationId: string, storeId: string) => {
  return useOptimizedQuery({
    queryKey: ["store-stock", organizationId, storeId],
    queryFn: async () => {
      const response = await fetch(`/api/organization/${organizationId}/stores/${storeId}/stock`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du stock');
      }
      return response.json();
    },
    enabled: !!organizationId && !!storeId,
  });
};
