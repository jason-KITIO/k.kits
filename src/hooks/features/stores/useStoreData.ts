import { useQuery } from "@tanstack/react-query";
import { storeService } from "@/services/store-service";

export const useStoreCategories = (organizationId: string, storeId: string) => {
  return useQuery({
    queryKey: ["organization", organizationId, "stores", storeId, "categories"],
    queryFn: async () => await storeService.getCategories(organizationId, storeId),
    enabled: !!organizationId && !!storeId,
    staleTime: 15 * 60 * 1000,
  });
};

export const useStoreSuppliers = (organizationId: string, storeId: string) => {
  return useQuery({
    queryKey: ["organization", organizationId, "stores", storeId, "suppliers"],
    queryFn: async () => await storeService.getSuppliers(organizationId, storeId),
    enabled: !!organizationId && !!storeId,
    staleTime: 10 * 60 * 1000,
  });
};
