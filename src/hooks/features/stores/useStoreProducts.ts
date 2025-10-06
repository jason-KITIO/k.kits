import { useQuery } from "@tanstack/react-query";
import { storeService } from "@/services/store-service";

export const useStoreProducts = (organizationId: string, storeId: string) => {
  return useQuery({
    queryKey: ["organization", organizationId, "stores", storeId, "products"],
    queryFn: async () => await storeService.getProducts(organizationId, storeId),
    enabled: !!organizationId && !!storeId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useStoreProduct = (organizationId: string, storeId: string, productId: string) => {
  return useQuery({
    queryKey: ["organization", organizationId, "stores", storeId, "products", productId],
    queryFn: async () => await storeService.getProduct(organizationId, storeId, productId),
    enabled: !!organizationId && !!storeId && !!productId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProductByBarcode = (organizationId: string, storeId: string, code: string) => {
  return useQuery({
    queryKey: ["organization", organizationId, "stores", storeId, "products", "barcode", code],
    queryFn: async () => await storeService.searchProductByBarcode(organizationId, storeId, code),
    enabled: !!organizationId && !!storeId && !!code && code.length > 2,
    staleTime: 10 * 60 * 1000,
  });
};
