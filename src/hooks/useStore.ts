import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storeService } from "@/services/store-service";
import type { SaleCreateInput, StockAdjustmentInput } from "@/schema";

export const useStores = (organizationId: string) => {
  return useQuery({
    queryKey: ["organization", organizationId, "stores"],
    queryFn: async () => await storeService.getStores(organizationId),
    enabled: !!organizationId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useStore = (organizationId: string, storeId: string) => {
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
    queryFn: async () =>
      await storeService.getDashboard(organizationId, storeId),
    enabled: !!organizationId && !!storeId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useStoreProducts = (organizationId: string, storeId: string) => {
  return useQuery({
    queryKey: ["organization", organizationId, "stores", storeId, "products"],
    queryFn: async () =>
      await storeService.getProducts(organizationId, storeId),
    enabled: !!organizationId && !!storeId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useStoreProduct = (
  organizationId: string,
  storeId: string,
  productId: string
) => {
  return useQuery({
    queryKey: [
      "organization",
      organizationId,
      "stores",
      storeId,
      "products",
      productId,
    ],
    queryFn: async () =>
      await storeService.getProduct(organizationId, storeId, productId),
    enabled: !!organizationId && !!storeId && !!productId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProductByBarcode = (
  organizationId: string,
  storeId: string,
  code: string
) => {
  return useQuery({
    queryKey: [
      "organization",
      organizationId,
      "stores",
      storeId,
      "products",
      "barcode",
      code,
    ],
    queryFn: async () =>
      await storeService.searchProductByBarcode(organizationId, storeId, code),
    enabled: !!organizationId && !!storeId && !!code && code.length > 2,
    staleTime: 10 * 60 * 1000,
  });
};

export const useStoreStock = (organizationId: string, storeId: string) => {
  return useQuery({
    queryKey: ["organization", organizationId, "stores", storeId, "stock"],
    queryFn: async () => await storeService.getStock(organizationId, storeId),
    enabled: !!organizationId && !!storeId,
    staleTime: 30 * 1000,
  });
};

export const useStoreStockMovements = (
  organizationId: string,
  storeId: string
) => {
  return useQuery({
    queryKey: [
      "organization",
      organizationId,
      "stores",
      storeId,
      "stock-movements",
    ],
    queryFn: async () =>
      await storeService.getStockMovements(organizationId, storeId),
    enabled: !!organizationId && !!storeId,
    staleTime: 1 * 60 * 1000,
  });
};

export const useStoreSales = (organizationId: string, storeId: string) => {
  return useQuery({
    queryKey: ["organization", organizationId, "stores", storeId, "sales"],
    queryFn: async () => await storeService.getSales(organizationId, storeId),
    enabled: !!organizationId && !!storeId,
    staleTime: 30 * 1000,
  });
};

export const useStoreSale = (
  organizationId: string,
  storeId: string,
  saleId: string
) => {
  return useQuery({
    queryKey: [
      "organization",
      organizationId,
      "stores",
      storeId,
      "sales",
      saleId,
    ],
    queryFn: async () =>
      await storeService.getSale(organizationId, storeId, saleId),
    enabled: !!organizationId && !!storeId && !!saleId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useStoreCustomers = (organizationId: string, storeId: string) => {
  return useQuery({
    queryKey: ["organization", organizationId, "stores", storeId, "customers"],
    queryFn: async () =>
      await storeService.getCustomers(organizationId, storeId),
    enabled: !!organizationId && !!storeId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useStoreCategories = (organizationId: string, storeId: string) => {
  return useQuery({
    queryKey: ["organization", organizationId, "stores", storeId, "categories"],
    queryFn: async () =>
      await storeService.getCategories(organizationId, storeId),
    enabled: !!organizationId && !!storeId,
    staleTime: 15 * 60 * 1000,
  });
};

export const useStoreSuppliers = (organizationId: string, storeId: string) => {
  return useQuery({
    queryKey: ["organization", organizationId, "stores", storeId, "suppliers"],
    queryFn: async () =>
      await storeService.getSuppliers(organizationId, storeId),
    enabled: !!organizationId && !!storeId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateStockAdjustment = (
  organizationId: string,
  storeId: string
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StockAdjustmentInput) =>
      await storeService.createStockAdjustment(organizationId, storeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization", organizationId, "stores", storeId, "stock"],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "organization",
          organizationId,
          "stores",
          storeId,
          "stock-movements",
        ],
      });
    },
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
        queryKey: [
          "organization",
          organizationId,
          "stores",
          storeId,
          "dashboard",
        ],
      });
    },
  });
};

export const useCreateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      organizationId,
      data,
    }: {
      organizationId: string;
      data: any;
    }) => await storeService.createStore(organizationId, data),
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({
        queryKey: ["organization", organizationId, "stores"],
      });
    },
  });
};

export const useCreateCustomer = (organizationId: string, storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) =>
      await storeService.createCustomer(organizationId, storeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "organization",
          organizationId,
          "stores",
          storeId,
          "customers",
        ],
      });
    },
  });
};

export const useCreateSupplier = (organizationId: string, storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) =>
      await storeService.createSupplier(organizationId, storeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "organization",
          organizationId,
          "stores",
          storeId,
          "suppliers",
        ],
      });
    },
  });
};

export const useCreateProduct = (organizationId: string, storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) =>
      await storeService.createProduct(organizationId, storeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "organization",
          organizationId,
          "stores",
          storeId,
          "products",
        ],
      });
    },
  });
};
