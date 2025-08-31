import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StockTransfer, CreateTransferData } from "@/types/transfer";
import * as transferService from "@/services/transfer-service";

export function useTransfers(organizationId: string) {
  return useQuery<StockTransfer[]>({
    queryKey: ["transfers", organizationId],
    queryFn: () => transferService.fetchTransfers(organizationId),
  });
}

export function usePendingTransfers(organizationId: string) {
  return useQuery<StockTransfer[]>({
    queryKey: ["transfers", "pending", organizationId],
    queryFn: () => transferService.fetchPendingTransfers(organizationId),
  });
}

export function useMyRequests(organizationId: string) {
  return useQuery<StockTransfer[]>({
    queryKey: ["transfers", "my-requests", organizationId],
    queryFn: () => transferService.fetchMyRequests(organizationId),
  });
}

export function useCreateTransfer(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransferData) =>
      transferService.createTransfer(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transfers", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["transfers", "pending", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["transfers", "my-requests", organizationId],
      });
    },
  });
}

export function useApproveTransfer(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transferId: string) =>
      transferService.approveTransfer(organizationId, transferId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transfers", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["transfers", "pending", organizationId],
      });
    },
  });
}

export function useCompleteTransfer(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transferId: string) =>
      transferService.completeTransfer(organizationId, transferId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transfers", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["transfers", "pending", organizationId],
      });
    },
  });
}

export function useCancelTransfer(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transferId: string) =>
      transferService.cancelTransfer(organizationId, transferId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transfers", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["transfers", "pending", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["transfers", "my-requests", organizationId],
      });
    },
  });
}
