import { useOptimizedQuery } from '../../use-optimized-query';
import type { PurchaseOrder, StockMovementRequest } from '@/types/warehouse';

export const useWarehousePurchaseOrders = (organizationId: string, warehouseId: string) => {
  return useOptimizedQuery({
    queryKey: ['warehouse-purchase-orders', organizationId, warehouseId],
    queryFn: async (): Promise<PurchaseOrder[]> => {
      const response = await fetch(`/api/organization/${organizationId}/warehouses/${warehouseId}/purchase-orders`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des commandes');
      }
      return response.json();
    },
    enabled: !!organizationId && !!warehouseId,
  });
};

export const useWarehouseStockMovementRequests = (organizationId: string, warehouseId: string) => {
  return useOptimizedQuery({
    queryKey: ['warehouse-stock-movement-requests', organizationId, warehouseId],
    queryFn: async (): Promise<StockMovementRequest[]> => {
      const response = await fetch(`/api/organization/${organizationId}/warehouses/${warehouseId}/stock-movement-requests`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des requêtes');
      }
      return response.json();
    },
    enabled: !!organizationId && !!warehouseId,
  });
};
