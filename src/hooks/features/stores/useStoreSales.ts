import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storeService } from "@/services/store-service";
import type { SaleCreateInput } from "@/schema";

export const useStoreSales = (organizationId: string, storeId: string) => {
  return useQuery({
    queryKey: ["organization", organizationId, "stores", storeId, "sales"],
    queryFn: async () => await storeService.getSales(organizationId, storeId),
    enabled: !!organizationId && !!storeId,
    staleTime: 30 * 1000,
  });
};

export const useStoreSale = (organizationId: string, storeId: string, saleId: string) => {
  return useQuery({
    queryKey: ["organization", organizationId, "stores", storeId, "sales", saleId],
    queryFn: async () => await storeService.getSale(organizationId, storeId, saleId),
    enabled: !!organizationId && !!storeId && !!saleId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSale = (organizationId: string, storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SaleCreateInput) =>
      await storeService.createSale(organizationId, storeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization", organizationId, "stores", storeId, "sales"],
      });
      queryClient.invalidateQueries({
        queryKey: ["organization", organizationId, "stores", storeId, "stock"],
      });
      queryClient.invalidateQueries({
        queryKey: ["organization", organizationId, "stores", storeId, "dashboard"],
      });
    },
  });
};
