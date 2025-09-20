import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { stockReturnService } from "@/services/stock-return-service";
import { toast } from "sonner";
import type { StockReturnCreateInput, StockReturnUpdateInput } from "@/schema/stock-return.schema";

export const useStockReturns = (
  organizationId: string, 
  storeId: string, 
  params?: { status?: string; returnedById?: string }
) => {
  return useQuery({
    queryKey: ["stock-returns", organizationId, storeId, params],
    queryFn: () => stockReturnService.getByStore(organizationId, storeId, params),
    enabled: !!organizationId && !!storeId,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

export const useStockReturn = (organizationId: string, storeId: string, returnId: string) => {
  return useQuery({
    queryKey: ["stock-return", organizationId, storeId, returnId],
    queryFn: () => stockReturnService.getById(organizationId, storeId, returnId),
    enabled: !!organizationId && !!storeId && !!returnId,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

export const useCreateStockReturn = (organizationId: string, storeId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: StockReturnCreateInput) => 
      stockReturnService.create(organizationId, storeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-returns", organizationId, storeId] });
      toast.success("Retour créé avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateStockReturn = (organizationId: string, storeId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ returnId, data }: { returnId: string; data: StockReturnUpdateInput }) =>
      stockReturnService.update(organizationId, storeId, returnId, data),
    onSuccess: (_, { returnId }) => {
      queryClient.invalidateQueries({ queryKey: ["stock-returns", organizationId, storeId] });
      queryClient.invalidateQueries({ queryKey: ["stock-return", organizationId, storeId, returnId] });
      toast.success("Retour traité avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteStockReturn = (organizationId: string, storeId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (returnId: string) => 
      stockReturnService.delete(organizationId, storeId, returnId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-returns", organizationId, storeId] });
      toast.success("Retour supprimé avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};