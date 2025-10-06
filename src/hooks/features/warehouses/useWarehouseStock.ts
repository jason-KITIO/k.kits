import { useOptimizedQuery } from '../../use-optimized-query';
import type { StockItem, StockMovement } from '@/types/warehouse';

export const useWarehouseStock = (organizationId: string, warehouseId: string) => {
  return useOptimizedQuery({
    queryKey: ['warehouse-stock', organizationId, warehouseId],
    queryFn: async (): Promise<StockItem[]> => {
      const response = await fetch(`/api/organization/${organizationId}/warehouses/${warehouseId}/stock`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du stock');
      }
      return response.json();
    },
    enabled: !!organizationId && !!warehouseId,
  });
};

export const useWarehouseStockMovements = (organizationId: string, warehouseId: string) => {
  return useOptimizedQuery({
    queryKey: ['warehouse-stock-movements', organizationId, warehouseId],
    queryFn: async (): Promise<StockMovement[]> => {
      const response = await fetch(`/api/organization/${organizationId}/warehouses/${warehouseId}/stock-movements`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des mouvements');
      }
      return response.json();
    },
    enabled: !!organizationId && !!warehouseId,
  });
};
