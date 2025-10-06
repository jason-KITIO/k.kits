import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useWarehouseToStoreTransfer = (organizationId: string, warehouseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      toStoreId: string;
      items: Array<{ productId: string; quantity: number }>;
      reason?: string;
    }) => {
      const response = await fetch(`/api/organization/${organizationId}/warehouses/${warehouseId}/store-transfers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors du transfert');
      }
      return response.json();
    },
    onSuccess: (_, { toStoreId }) => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-stock', organizationId, warehouseId] });
      queryClient.invalidateQueries({ queryKey: ['store-stock', organizationId, toStoreId] });
      queryClient.invalidateQueries({ queryKey: ['warehouse-stock-movements', organizationId, warehouseId] });
      toast.success('Transfert effectué avec succès');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
