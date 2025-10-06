import { useQuery } from "@tanstack/react-query";
import { storeService } from "@/services/store-service";

export const useStoreList = (organizationId: string) => {
  return useQuery({
    queryKey: ["organization", organizationId, "stores"],
    queryFn: async () => await storeService.getStores(organizationId),
    enabled: !!organizationId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useStoreDetail = (organizationId: string, storeId: string) => {
  return useQuery({
    queryKey: ["organization", organizationId, "stores", storeId],
    queryFn: async () => await storeService.getStore(organizationId, storeId),
    enabled: !!organizationId && !!storeId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useStoreDashboard = (organizationId: string, storeId: string) => {
  return useQuery({
    queryKey: ["organization", organizationId, "stores", storeId, "dashboard"],
    queryFn: async () => await storeService.getDashboard(organizationId, storeId),
    enabled: !!organizationId && !!storeId,
    staleTime: 2 * 60 * 1000,
  });
};
