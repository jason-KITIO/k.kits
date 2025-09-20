import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { stockMovementRequestService } from "@/services/stock-movement-request-service";
import { toast } from "sonner";
import type { StockMovementRequestCreate, StockMovementRequestApproval } from "@/types/stock-movement-request";

export const useStockMovementRequests = (
  organizationId: string, 
  storeId: string, 
  params?: { status?: string; requesterId?: string }
) => {
  return useQuery({
    queryKey: ["stock-movement-requests", organizationId, storeId, params],
    queryFn: () => stockMovementRequestService.getByStore(organizationId, storeId, params),
    enabled: !!organizationId && !!storeId,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

export const useStockMovementRequest = (organizationId: string, storeId: string, requestId: string) => {
  return useQuery({
    queryKey: ["stock-movement-request", organizationId, storeId, requestId],
    queryFn: () => stockMovementRequestService.getById(organizationId, storeId, requestId),
    enabled: !!organizationId && !!storeId && !!requestId,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

export const useCreateStockMovementRequest = (organizationId: string, storeId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: StockMovementRequestCreate) => 
      stockMovementRequestService.create(organizationId, storeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-movement-requests", organizationId, storeId] });
      toast.success("Demande de mouvement créée avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useApproveStockMovementRequest = (organizationId: string, storeId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ requestId, data }: { requestId: string; data: StockMovementRequestApproval }) =>
      stockMovementRequestService.approve(organizationId, storeId, requestId, data),
    onSuccess: (_, { requestId }) => {
      queryClient.invalidateQueries({ queryKey: ["stock-movement-requests", organizationId, storeId] });
      queryClient.invalidateQueries({ queryKey: ["stock-movement-request", organizationId, storeId, requestId] });
      toast.success("Demande traitée avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};