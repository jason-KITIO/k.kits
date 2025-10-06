import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Warehouse, PurchaseOrderCreateData, StockAdjustmentData, StockTransferData } from '@/types/warehouse';

export const useCreateWarehouse = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Warehouse, 'id'>) => {
      const transformedData = {
        ...data,
        capacity: data.capacity ? Number(data.capacity) : undefined,
      };
      const response = await fetch(`/api/organization/${organizationId}/warehouses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(transformedData),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'entrepôt');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses', organizationId] });
      toast.success('Succès', {
        description: 'Entrepôt créé avec succès',
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

export const useUpdateWarehouse = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ warehouseId, data }: { warehouseId: string; data: Partial<Omit<Warehouse, 'id'>> }) => {
      const response = await fetch(`/api/organization/${organizationId}/warehouses/${warehouseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors de la modification de l\'entrepôt');
      }
      return response.json();
    },
    onSuccess: (_, { warehouseId }) => {
      queryClient.invalidateQueries({ queryKey: ['warehouses', organizationId] });
      queryClient.invalidateQueries({ queryKey: ['warehouse', organizationId, warehouseId] });
      toast.success('Succès', {
        description: 'Entrepôt modifié avec succès',
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

export const useDeleteWarehouse = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ warehouseId, transferToWarehouseId, forceDelete }: { 
      warehouseId: string; 
      transferToWarehouseId?: string; 
      forceDelete?: boolean; 
    }) => {
      const response = await fetch(`/api/organization/${organizationId}/warehouses/${warehouseId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ transferToWarehouseId, forceDelete }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 409) {
          throw { status: 409, data: errorData };
        }
        throw new Error(errorData.error || 'Erreur lors de la suppression de l\'entrepôt');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses', organizationId] });
      toast.success('Succès', {
        description: 'Entrepôt supprimé avec succès',
        duration: 5000,
      });
    },
    onError: (error: { status?: number; message?: string }) => {
      if (error.status !== 409) {
        toast.error('Erreur', {
          description: error.message,
          duration: 5000,
        });
      }
    },
  });
};
