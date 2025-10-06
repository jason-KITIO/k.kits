import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storeService } from "@/services/store-service";
import type { Customer } from "@/types/customer";

export const useStoreCustomers = (organizationId: string, storeId: string) => {
  return useQuery({
    queryKey: ["organization", organizationId, "stores", storeId, "customers"],
    queryFn: async () => await storeService.getCustomers(organizationId, storeId),
    enabled: !!organizationId && !!storeId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useStoreCustomer = (organizationId: string, storeId: string, customerId: string) => {
  return useQuery({
    queryKey: ["organization", organizationId, "stores", storeId, "customers", customerId],
    queryFn: async () => await storeService.getCustomer(organizationId, storeId, customerId),
    enabled: !!organizationId && !!storeId && !!customerId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateCustomer = (organizationId: string, storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Customer>) =>
      await storeService.createCustomer(organizationId, storeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization", organizationId, "stores", storeId, "customers"],
      });
    },
  });
};

export const useUpdateCustomer = (organizationId: string, storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customerId, data }: { customerId: string; data: Partial<Customer> }) =>
      await storeService.updateCustomer(organizationId, storeId, customerId, data),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({
        queryKey: ["organization", organizationId, "stores", storeId, "customers"],
      });
      queryClient.invalidateQueries({
        queryKey: ["organization", organizationId, "stores", storeId, "customers", customerId],
      });
    },
  });
};

export const useDeleteCustomer = (organizationId: string, storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customerId: string) =>
      await storeService.deleteCustomer(organizationId, storeId, customerId),
    onSuccess: (_, customerId) => {
      queryClient.removeQueries({
        queryKey: ["organization", organizationId, "stores", storeId, "customers", customerId],
      });
      queryClient.invalidateQueries({
        queryKey: ["organization", organizationId, "stores", storeId, "customers"],
        exact: true,
      });
    },
  });
};
