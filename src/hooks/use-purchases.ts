import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PurchaseOrder,
  Supplier,
  CreatePurchaseOrderData,
  CreateSupplierData,
} from "@/types/purchase";
import * as purchaseService from "@/services/purchase-service";

// Purchase Orders
export function usePurchaseOrders(organizationId: string) {
  return useQuery<PurchaseOrder[]>({
    queryKey: ["purchase-orders", organizationId],
    queryFn: () => purchaseService.fetchPurchaseOrders(organizationId),
  });
}

export function useCreatePurchaseOrder(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePurchaseOrderData) =>
      purchaseService.createPurchaseOrder(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchase-orders", organizationId],
      });
    },
  });
}

export function useUpdatePurchaseOrder(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreatePurchaseOrderData>;
    }) => purchaseService.updatePurchaseOrder(organizationId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchase-orders", organizationId],
      });
    },
  });
}

export function useDeletePurchaseOrder(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      purchaseService.deletePurchaseOrder(organizationId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchase-orders", organizationId],
      });
    },
  });
}

// Suppliers
export function useSuppliers(organizationId: string) {
  return useQuery<Supplier[]>({
    queryKey: ["suppliers", organizationId],
    queryFn: () => purchaseService.fetchSuppliers(organizationId),
  });
}

export function useCreateSupplier(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSupplierData) =>
      purchaseService.createSupplier(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["suppliers", organizationId],
      });
    },
  });
}

export function useUpdateSupplier(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateSupplierData>;
    }) => purchaseService.updateSupplier(organizationId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["suppliers", organizationId],
      });
    },
  });
}

export function useDeleteSupplier(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      purchaseService.deleteSupplier(organizationId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["suppliers", organizationId],
      });
    },
  });
}
