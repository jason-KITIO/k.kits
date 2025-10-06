"use client";

import { useParams } from "next/navigation";
import { useOptimizedQuery } from "@/hooks/use-optimized-query";
import { useCurrencyFormatter } from "@/hooks/use-currency";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type PurchaseOrderDetail = {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  expectedDate?: string;
  createdAt: string;
  supplier: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  user: {
    firstName: string;
    lastName: string;
  };
  warehouse: {
    name: string;
    address?: string;
  };
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    product: {
      name: string;
      sku: string;
    };
  }>;
};

export function usePurchaseOrderDetail() {
  const params = useParams();
  const organizationId = params.id as string;
  const warehouseId = params.warehouseId as string;
  const orderId = params.orderId as string;
  const formatCurrency = useCurrencyFormatter(organizationId);
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useOptimizedQuery({
    queryKey: ['purchase-order', organizationId, warehouseId, orderId],
    queryFn: async (): Promise<PurchaseOrderDetail> => {
      const response = await fetch(
        `/api/organization/${organizationId}/warehouses/${warehouseId}/purchase-orders/${orderId}`,
        { credentials: 'include' }
      );
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de la commande');
      }
      return response.json();
    },
    enabled: !!organizationId && !!warehouseId && !!orderId,
  });

  const markAsReceivedMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `/api/organization/${organizationId}/warehouses/${warehouseId}/purchase-orders/${orderId}/receive`,
        { method: 'POST', credentials: 'include' }
      );
      if (!response.ok) throw new Error('Erreur lors de la réception de la commande');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-order', organizationId, warehouseId, orderId] });
      queryClient.invalidateQueries({ queryKey: ['warehouse-stocks', organizationId, warehouseId] });
      toast.success('Commande marquée comme reçue et stock mis à jour');
    },
    onError: () => toast.error('Erreur lors de la réception de la commande'),
  });

  return {
    organizationId,
    warehouseId,
    orderId,
    order,
    isLoading,
    formatCurrency,
    markAsReceived: markAsReceivedMutation.mutate,
    isMarkingAsReceived: markAsReceivedMutation.isPending,
  };
}