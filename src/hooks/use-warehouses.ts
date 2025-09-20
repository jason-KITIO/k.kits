import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { warehouseService } from "@/services/warehouse-service";
import { toast } from "sonner";
import type { 
  WarehouseCreateInput, 
  WarehouseUpdateInput,
  PurchaseOrderCreateInput,
  PurchaseOrderUpdateInput,
  StockAdjustmentInput 
} from "@/schema";

export const useWarehouses = (organizationId: string) => {
  return useQuery({
    queryKey: ["warehouses", organizationId],
    queryFn: async () => await warehouseService.getWarehouses(organizationId),
    enabled: !!organizationId,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useWarehouse = (organizationId: string, warehouseId: string) => {
  return useQuery({
    queryKey: ["warehouse", organizationId, warehouseId],
    queryFn: async () => await warehouseService.getWarehouse(organizationId, warehouseId),
    enabled: !!organizationId && !!warehouseId,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useCreateWarehouse = (organizationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: WarehouseCreateInput) => 
      await warehouseService.createWarehouse(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses", organizationId] });
      toast.success("Succès", {
        description: "Entrepôt créé avec succès",
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

export const useUpdateWarehouse = (organizationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ warehouseId, data }: { warehouseId: string; data: WarehouseUpdateInput }) =>
      await warehouseService.updateWarehouse(organizationId, warehouseId, data),
    onSuccess: (_, { warehouseId }) => {
      queryClient.invalidateQueries({ queryKey: ["warehouses", organizationId] });
      queryClient.invalidateQueries({ queryKey: ["warehouse", organizationId, warehouseId] });
      toast.success("Succès", {
        description: "Entrepôt modifié avec succès",
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

export const useDeleteWarehouse = (organizationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (warehouseId: string) => 
      await warehouseService.deleteWarehouse(organizationId, warehouseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses", organizationId] });
      toast.success("Succès", {
        description: "Entrepôt supprimé avec succès",
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

export const useWarehouseStock = (organizationId: string, warehouseId: string) => {
  return useQuery({
    queryKey: ["warehouse-stock", organizationId, warehouseId],
    queryFn: async () => await warehouseService.getStock(organizationId, warehouseId),
    enabled: !!organizationId && !!warehouseId,
    staleTime: 300000, // 5 minutes
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useWarehouseStockMovements = (organizationId: string, warehouseId: string) => {
  return useQuery({
    queryKey: ["warehouse-stock-movements", organizationId, warehouseId],
    queryFn: async () => await warehouseService.getStockMovements(organizationId, warehouseId),
    enabled: !!organizationId && !!warehouseId,
    staleTime: 300000, // 5 minutes
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useCreateStockAdjustment = (organizationId: string, warehouseId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: StockAdjustmentInput) => 
      await warehouseService.createStockAdjustment(organizationId, warehouseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse-stock", organizationId, warehouseId] });
      queryClient.invalidateQueries({ queryKey: ["warehouse-stock-movements", organizationId, warehouseId] });
      toast.success("Succès", {
        description: "Ajustement de stock effectué avec succès",
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

export const useWarehousePurchaseOrders = (organizationId: string, warehouseId: string) => {
  return useQuery({
    queryKey: ["warehouse-purchase-orders", organizationId, warehouseId],
    queryFn: async () => await warehouseService.getPurchaseOrders(organizationId, warehouseId),
    enabled: !!organizationId && !!warehouseId,
    staleTime: 300000, // 5 minutes
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useWarehousePurchaseOrder = (organizationId: string, warehouseId: string, orderId: string) => {
  return useQuery({
    queryKey: ["warehouse-purchase-order", organizationId, warehouseId, orderId],
    queryFn: async () => await warehouseService.getPurchaseOrder(organizationId, warehouseId, orderId),
    enabled: !!organizationId && !!warehouseId && !!orderId,
    staleTime: 300000, // 5 minutes
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useCreatePurchaseOrder = (organizationId: string, warehouseId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PurchaseOrderCreateInput) => 
      await warehouseService.createPurchaseOrder(organizationId, warehouseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse-purchase-orders", organizationId, warehouseId] });
      toast.success("Succès", {
        description: "Commande d'achat créée avec succès",
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

export const useUpdatePurchaseOrder = (organizationId: string, warehouseId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ orderId, data }: { orderId: string; data: PurchaseOrderUpdateInput }) =>
      await warehouseService.updatePurchaseOrder(organizationId, warehouseId, orderId, data),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ["warehouse-purchase-orders", organizationId, warehouseId] });
      queryClient.invalidateQueries({ queryKey: ["warehouse-purchase-order", organizationId, warehouseId, orderId] });
      toast.success("Succès", {
        description: "Commande d'achat modifiée avec succès",
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