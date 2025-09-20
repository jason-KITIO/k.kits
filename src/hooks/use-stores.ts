import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

export const useStores = (organizationId: string, filters: Partial<StoreFilters> = {}) => {
  return useQuery({
    queryKey: ["stores", organizationId, filters],
    queryFn: async () => await storeService.getStores(organizationId, filters),
    enabled: !!organizationId,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useStore = (organizationId: string, storeId: string) => {
  return useQuery({
    queryKey: ["store", organizationId, storeId],
    queryFn: async () => await storeService.getStore(organizationId, storeId),
    enabled: !!organizationId && !!storeId,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
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
    mutationFn: async ({ storeId, data }: { storeId: string; data: StoreUpdateInput }) =>
      await storeService.updateStore(organizationId, storeId, data),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({ queryKey: ["stores", organizationId] });
      queryClient.invalidateQueries({ queryKey: ["store", organizationId, storeId] });
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

export const useDeleteStore = (organizationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (storeId: string) => 
      await storeService.deleteStore(organizationId, storeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores", organizationId] });
      toast.success("Succès", {
        description: "Boutique supprimée avec succès",
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