import { useOptimizedQuery } from '../../use-optimized-query';
import type { Warehouse } from '@/types/warehouse';

export const useWarehouseList = (organizationId: string) => {
  return useOptimizedQuery({
    queryKey: ['warehouses', organizationId],
    queryFn: async (): Promise<Warehouse[]> => {
      const response = await fetch(`/api/organization/${organizationId}/warehouses`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des entrepôts');
      }
      return response.json();
    },
    enabled: !!organizationId,
  });
};

export const useWarehouseDetail = (organizationId: string, warehouseId: string) => {
  return useOptimizedQuery({
    queryKey: ['warehouse', organizationId, warehouseId],
    queryFn: async (): Promise<Warehouse> => {
      const response = await fetch(`/api/organization/${organizationId}/warehouses/${warehouseId}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'entrepôt');
      }
      return response.json();
    },
    enabled: !!organizationId && !!warehouseId,
  });
};
