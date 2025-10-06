import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { PurchaseOrderCreateData, StockAdjustmentData, StockTransferData } from '@/types/warehouse';

export const useCreatePurchaseOrder = (organizationId: string, warehouseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PurchaseOrderCreateData) => {
      const response = await fetch(`/api/organization/${organizationId}/warehouses/${warehouseId}/purchase-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la création de la commande');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-purchase-orders', organizationId, warehouseId] });
      toast.success('Succès', {
        description: 'Commande créée avec succès',
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      toast.error('Erreur', {
        description: error.message,
        duration: 5000,
      });
    },
  });
};

export const useCreateStockAdjustment = (organizationId: string, warehouseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StockAdjustmentData) => {
      const response = await fetch(`/api/organization/${organizationId}/warehouses/${warehouseId}/stock-adjustments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajustement du stock');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-stock', organizationId, warehouseId] });
      queryClient.invalidateQueries({ queryKey: ['warehouse-stock-movements', organizationId, warehouseId] });
      toast.success('Succès', {
        description: 'Ajustement de stock effectué avec succès',
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      toast.error('Erreur', {
        description: error.message,
        duration: 5000,
      });
    },
  });
};

export const useCreateStockTransfer = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StockTransferData) => {
      const response = await fetch(`/api/organization/${organizationId}/stock-transfers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors du transfert de stock');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses', organizationId] });
      queryClient.invalidateQueries({ queryKey: ['warehouse-stock', organizationId] });
      queryClient.invalidateQueries({ queryKey: ['warehouse-stock-movements', organizationId] });
      toast.success('Succès', {
        description: 'Transfert de stock effectué avec succès',
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      toast.error('Erreur', {
        description: error.message,
        duration: 5000,
      });
    },
  });
};
