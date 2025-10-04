import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOptimizedQuery } from "./use-optimized-query";
import { storeService } from "@/services/store-service";
import { toast } from "sonner";
import type { StoreCreateInput, StoreUpdateInput } from "@/schema/store-schema";

type StoreFilters = {
  type?: "PHYSICAL" | "ONLINE" | "HYBRID";
  active?: boolean;
  managerId?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export const useStores = (
  organizationId: string,
  filters: Partial<StoreFilters> = {}
) => {
  return useOptimizedQuery({
    queryKey: ["stores", organizationId, filters],
    queryFn: async () => await storeService.getStores(organizationId, filters),
    enabled: !!organizationId,
  });
};

export const useStore = (organizationId: string, storeId: string) => {
  return useOptimizedQuery({
    queryKey: ["store", organizationId, storeId],
    queryFn: async () => await storeService.getStore(organizationId, storeId),
    enabled: !!organizationId && !!storeId,
  });
};

export const useCreateStore = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StoreCreateInput) =>
      await storeService.createStore(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores", organizationId] });
      toast.success("Succès", {
        description: "Boutique créée avec succès",
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      toast.error("Erreur", {
        description: error.message,
        duration: 5000,
      });
    },
  });
};

export const useUpdateStore = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      storeId,
      data,
    }: {
      storeId: string;
      data: StoreUpdateInput;
    }) => await storeService.updateStore(organizationId, storeId, data),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({ queryKey: ["stores", organizationId] });
      queryClient.invalidateQueries({
        queryKey: ["store", organizationId, storeId],
      });
      toast.success("Succès", {
        description: "Boutique modifiée avec succès",
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      toast.error("Erreur", {
        description: error.message,
        duration: 5000,
      });
    },
  });
};

export const useDeleteStore = (organizationId: string, onClose?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (storeId: string) =>
      await storeService.deleteStore(organizationId, storeId),
    onSuccess: (_, storeId) => {
      queryClient.removeQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return Array.isArray(queryKey) && 
                 queryKey.includes(storeId) && 
                 queryKey.includes(organizationId);
        },
      });
      queryClient.invalidateQueries({ 
        queryKey: ["stores", organizationId],
      });
      toast.success("Succès", {
        description: "Boutique supprimée avec succès",
        duration: 5000,
      });
      onClose?.();
    },
    onError: (error: Error) => {
      if (error.message.includes('404') || error.message.includes('non trouvée')) {
        queryClient.invalidateQueries({ 
          queryKey: ["stores", organizationId],
        });
        toast.success("Succès", {
          description: "Boutique déjà supprimée",
          duration: 5000,
        });
        onClose?.();
      } else {
        toast.error("Erreur", {
          description: error.message,
          duration: 5000,
        });
      }
    },
  });
};

export const useStoreStock = (organizationId: string, storeId: string) => {
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
