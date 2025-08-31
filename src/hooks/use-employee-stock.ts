import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  EmployeeStock,
  StockRequest,
  StockAdjustment,
  CreateStockRequestData,
  CreateAdjustmentData,
} from "@/types/employee-stock";
import * as employeeStockService from "@/services/employee-stock-service";

// Employee Stock
export function useEmployeeStock(organizationId: string, userId?: string) {
  return useQuery<EmployeeStock[]>({
    queryKey: ["employee-stock", organizationId, userId],
    queryFn: () =>
      employeeStockService.fetchEmployeeStock(organizationId, userId),
  });
}

export function useAdjustEmployeeStock(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAdjustmentData) =>
      employeeStockService.adjustEmployeeStock(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employee-stock", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["stock-adjustments", organizationId],
      });
    },
  });
}

// Stock Requests
export function useStockRequests(organizationId: string, userId?: string) {
  return useQuery<StockRequest[]>({
    queryKey: ["stock-requests", organizationId, userId],
    queryFn: () =>
      employeeStockService.fetchStockRequests(organizationId, userId),
  });
}

export function useCreateStockRequest(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStockRequestData) =>
      employeeStockService.createStockRequest(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stock-requests", organizationId],
      });
    },
  });
}

export function useApproveStockRequest(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) =>
      employeeStockService.approveStockRequest(organizationId, requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stock-requests", organizationId],
      });
    },
  });
}

export function useCancelStockRequest(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) =>
      employeeStockService.cancelStockRequest(organizationId, requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stock-requests", organizationId],
      });
    },
  });
}

// Stock Adjustments
export function useStockAdjustments(organizationId: string, userId?: string) {
  return useQuery<StockAdjustment[]>({
    queryKey: ["stock-adjustments", organizationId, userId],
    queryFn: () =>
      employeeStockService.fetchStockAdjustments(organizationId, userId),
  });
}
