import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storeService } from "@/services/store-service";
import type { StockMovementAdjustmentInput } from "@/schema";

export const useStoreStock = (organizationId: string, storeId: string) => {
  return useQuery({
    queryKey: ["organization", organizationId, "stores", storeId, "stock"],
    queryFn: async () => await storeService.getStock(organizationId, storeId),
    enabled: !!organizationId && !!storeId,
    staleTime: 30 * 1000,
  });
};

export const useStoreStockMovements = (organizationId: string, storeId: string) => {
  return useQuery({
    queryKey: ["organization", organizationId, "stores", storeId, "stock-movements"],
    queryFn: async () => await storeService.getStockMovements(organizationId, storeId),
    enabled: !!organizationId && !!storeId,
    staleTime: 1 * 60 * 1000,
  });
};

export const useCreateStockAdjustment = (organizationId: string, storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StockMovementAdjustmentInput) =>
      await storeService.createStockAdjustment(organizationId, storeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization", organizationId, "stores", storeId, "stock"],
      });
      queryClient.invalidateQueries({
        queryKey: ["organization", organizationId, "stores", storeId, "stock-movements"],
      });
    },
  });
};
