import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOptimizedQuery } from "./use-optimized-query";
import { toast } from "sonner";

export const useStockMovementRequests = (organizationId: string, storeId?: string) => {
  return useOptimizedQuery({
    queryKey: ["stock-movement-requests", organizationId, storeId],
    queryFn: async () => {
      const url = storeId 
        ? `/api/organization/${organizationId}/stores/${storeId}/stock-movement-requests`
        : `/api/organization/${organizationId}/stock-movement-requests`;
      
      const response = await fetch(url, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des requêtes');
      }
      return response.json();
    },
    enabled: !!organizationId,
  });
};

export const useCreateStockRequest = (organizationId: string, storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      productId: string;
      quantity: number;
      urgencyLevel: string;
      reason?: string;
    }) => {
      const response = await fetch(`/api/organization/${organizationId}/stores/${storeId}/stock-movement-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors de la création de la requête');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-movement-requests', organizationId, storeId] });
      toast.success('Demande créée avec succès');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useApproveStockRequest = (organizationId: string, storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: string) => {
      const response = await fetch(`/api/organization/${organizationId}/stores/${storeId}/stock-movement-requests/${requestId}/approve`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors de l\'approbation');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-movement-requests', organizationId, storeId] });
      toast.success('Requête approuvée avec succès');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useCreateStockMovementRequest = (organizationId: string, storeId: string) => {
  return useCreateStockRequest(organizationId, storeId);
};

export const useApproveStockMovementRequest = (organizationId: string, storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, data }: { requestId: string; data: { status: string; approverId: string; rejectionReason?: string } }) => {
      const response = await fetch(`/api/organization/${organizationId}/stores/${storeId}/stock-movement-requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors de la mise à jour');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-movement-requests', organizationId, storeId] });
      toast.success('Demande mise à jour avec succès');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};