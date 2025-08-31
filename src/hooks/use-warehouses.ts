import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Warehouse,
  WarehouseStock,
  StockLocation,
  CreateWarehouseData,
  UpdateWarehouseData,
  CreateLocationData,
  UpdateLocationData,
} from "@/types/warehouse";
import * as warehouseService from "@/services/warehouse-service";

// Warehouses
export function useWarehouses(organizationId: string) {
  return useQuery<Warehouse[]>({
    queryKey: ["warehouses", organizationId],
    queryFn: () => warehouseService.fetchWarehouses(organizationId),
  });
}

export function useCreateWarehouse(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWarehouseData) =>
      warehouseService.createWarehouse(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["warehouses", organizationId],
      });
    },
  });
}

export function useUpdateWarehouse(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWarehouseData }) =>
      warehouseService.updateWarehouse(organizationId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["warehouses", organizationId],
      });
    },
  });
}

export function useDeleteWarehouse(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      warehouseService.deleteWarehouse(organizationId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["warehouses", organizationId],
      });
    },
  });
}

// Warehouse Stock
export function useWarehouseStock(
  organizationId: string,
  warehouseId?: string
) {
  return useQuery<WarehouseStock[]>({
    queryKey: ["warehouse-stock", organizationId, warehouseId],
    queryFn: () =>
      warehouseService.fetchWarehouseStock(organizationId, warehouseId),
  });
}

// Stock Locations
export function useLocations(organizationId: string, warehouseId: string) {
  return useQuery<StockLocation[]>({
    queryKey: ["locations", organizationId, warehouseId],
    queryFn: () => warehouseService.fetchLocations(organizationId, warehouseId),
    enabled: !!warehouseId,
  });
}

export function useCreateLocation(organizationId: string, warehouseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLocationData) =>
      warehouseService.createLocation(organizationId, warehouseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["locations", organizationId, warehouseId],
      });
    },
  });
}

export function useUpdateLocation(organizationId: string, warehouseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLocationData }) =>
      warehouseService.updateLocation(organizationId, warehouseId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["locations", organizationId, warehouseId],
      });
    },
  });
}

export function useDeleteLocation(organizationId: string, warehouseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      warehouseService.deleteLocation(organizationId, warehouseId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["locations", organizationId, warehouseId],
      });
    },
  });
}
