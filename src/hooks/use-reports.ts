import { useQuery, useMutation } from "@tanstack/react-query";
import {
  StockReport,
  MovementReport,
  PerformanceReport,
  ExportData,
} from "@/types/report";
import * as reportService from "@/services/report-service";

export function useStockReport(organizationId: string, warehouseId?: string) {
  return useQuery<StockReport[]>({
    queryKey: ["reports", "stock", organizationId, warehouseId],
    queryFn: () => reportService.fetchStockReport(organizationId, warehouseId),
  });
}

export function useMovementReport(
  organizationId: string,
  dateFrom?: string,
  dateTo?: string
) {
  return useQuery<MovementReport[]>({
    queryKey: ["reports", "movements", organizationId, dateFrom, dateTo],
    queryFn: () =>
      reportService.fetchMovementReport(organizationId, dateFrom, dateTo),
  });
}

export function usePerformanceReport(organizationId: string) {
  return useQuery<PerformanceReport>({
    queryKey: ["reports", "performance", organizationId],
    queryFn: () => reportService.fetchPerformanceReport(organizationId),
  });
}

export function useExportData(organizationId: string) {
  return useMutation({
    mutationFn: (exportConfig: ExportData) =>
      reportService.exportData(organizationId, exportConfig),
  });
}
