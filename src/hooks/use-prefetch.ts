import { useQueryClient } from "@tanstack/react-query";
import { organizationService } from "@/services/organization-service";
import { storeService } from "@/services/store-service";

export function usePrefetch() {
  const queryClient = useQueryClient();

  // Prefetch données d'organisation
  const prefetchOrganization = (organizationId: string) => {
    queryClient.prefetchQuery({
      queryKey: ["organization", organizationId],
      queryFn: () => organizationService.getDashboard(organizationId),
    });
  };

  // Prefetch données de boutique
  const prefetchStore = (organizationId: string, storeId: string) => {
    queryClient.prefetchQuery({
      queryKey: ["organization", organizationId, "stores", storeId],
      queryFn: () => storeService.getStore(organizationId, storeId),
    });
  };

  // Prefetch produits d'une boutique
  const prefetchStoreProducts = (organizationId: string, storeId: string) => {
    queryClient.prefetchQuery({
      queryKey: ["organization", organizationId, "stores", storeId, "products"],
      queryFn: () => storeService.getProducts(organizationId, storeId),
    });
  };

  // Prefetch stock d'une boutique
  const prefetchStoreStock = (organizationId: string, storeId: string) => {
    queryClient.prefetchQuery({
      queryKey: ["organization", organizationId, "stores", storeId, "stock"],
      queryFn: () => storeService.getStock(organizationId, storeId),
    });
  };

  // Prefetch complet pour une boutique (dashboard + produits + stock)
  const prefetchStoreComplete = (organizationId: string, storeId: string) => {
    prefetchStore(organizationId, storeId);
    prefetchStoreProducts(organizationId, storeId);
    prefetchStoreStock(organizationId, storeId);
  };

  return {
    prefetchOrganization,
    prefetchStore,
    prefetchStoreProducts,
    prefetchStoreStock,
    prefetchStoreComplete,
  };
}