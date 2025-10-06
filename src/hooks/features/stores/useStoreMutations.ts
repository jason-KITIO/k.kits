import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storeService } from "@/services/store-service";
import type { StoreCreateInput, StoreUpdateInput } from "@/schema/store-schema";

export const useCreateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ organizationId, data }: { organizationId: string; data: StoreCreateInput }) =>
      await storeService.createStore(organizationId, data),
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({
        queryKey: ["organization", organizationId, "stores"],
      });
    },
  });
};

export const useUpdateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ organizationId, storeId, data }: { organizationId: string; storeId: string; data: StoreUpdateInput }) =>
      await storeService.updateStore(organizationId, storeId, data),
    onSuccess: (_, { organizationId, storeId }) => {
      queryClient.invalidateQueries({
        queryKey: ["organization", organizationId, "stores"],
      });
      queryClient.invalidateQueries({
        queryKey: ["organization", organizationId, "stores", storeId],
      });
    },
  });
};

export const useDeleteStore = (onClose?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ organizationId, storeId }: { organizationId: string; storeId: string }) =>
      await storeService.deleteStore(organizationId, storeId),
    onSuccess: (_, { organizationId, storeId }) => {
      queryClient.removeQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return Array.isArray(queryKey) && 
                 queryKey.includes(storeId) && 
                 queryKey.includes(organizationId);
        },
      });
      queryClient.invalidateQueries({
        queryKey: ["organization", organizationId, "stores"],
        exact: true,
      });
      onClose?.();
    },
    onError: (error: Error) => {
      if (error.message.includes('404') || error.message.includes('non trouvée')) {
        onClose?.();
      }
    },
  });
};

export const useCreateSupplier = (organizationId: string, storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; email?: string; phone?: string }) =>
      await storeService.createSupplier(organizationId, storeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization", organizationId, "stores", storeId, "suppliers"],
      });
    },
  });
};

export const useCreateProduct = (organizationId: string, storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { sku: string; name: string; description?: string; unitPrice: number; costPrice: number; minStock: number; active: boolean }) =>
      await storeService.createProduct(organizationId, storeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization", organizationId, "stores", storeId, "products"],
      });
    },
  });
};
