import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  StockInventory,
  CreateInventoryData,
  UpdateInventoryData,
} from "@/types/inventory";
import * as inventoryService from "@/services/inventory-service";

export function useInventories(organizationId: string) {
  return useQuery<StockInventory[]>({
    queryKey: ["inventories", organizationId],
    queryFn: () => inventoryService.fetchInventories(organizationId),
  });
}

export function useScheduledInventories(organizationId: string) {
  return useQuery<StockInventory[]>({
    queryKey: ["inventories", "scheduled", organizationId],
    queryFn: () => inventoryService.fetchScheduledInventories(organizationId),
  });
}

export function useCreateInventory(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInventoryData) =>
      inventoryService.createInventory(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventories", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["inventories", "scheduled", organizationId],
      });
    },
  });
}

export function useUpdateInventory(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInventoryData }) =>
      inventoryService.updateInventory(organizationId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventories", organizationId],
      });
    },
  });
}

export function useDeleteInventory(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      inventoryService.deleteInventory(organizationId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventories", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["inventories", "scheduled", organizationId],
      });
    },
  });
}
