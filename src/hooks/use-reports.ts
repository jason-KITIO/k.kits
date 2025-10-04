import { useQuery, useMutation } from "@tanstack/react-query";
import { ReportService } from "@/services/report-service";
import type { ReportRequest } from "@/schema/report.schema";
import { toast } from "sonner";

export function useReports(organizationId: string) {
  return {
    // Sales Reports
    useSalesReport: (params: ReportRequest) =>
      useQuery({
        queryKey: ["reports", "sales", organizationId, params],
        queryFn: () => ReportService.getSalesReport(organizationId, params),
        enabled: !!organizationId && params.type === "sales",
      }),

    // Stock Reports  
    useStockReport: (params: ReportRequest) =>
      useQuery({
        queryKey: ["reports", "stock", organizationId, params],
        queryFn: () => ReportService.getStockReport(organizationId, params),
        enabled: !!organizationId && params.type === "stock",
      }),

    // Movement Reports
    useMovementReport: (params: ReportRequest) =>
      useQuery({
        queryKey: ["reports", "movements", organizationId, params],
        queryFn: () => ReportService.getMovementReport(organizationId, params),
        enabled: !!organizationId && params.type === "movements",
      }),

    // Profit Reports
    useProfitReport: (params: ReportRequest) =>
      useQuery({
        queryKey: ["reports", "profit", organizationId, params],
        queryFn: () => ReportService.getProfitReport(organizationId, params),
        enabled: !!organizationId && params.type === "profit",
      }),

    // Customer Reports
    useCustomerReport: (params: ReportRequest) =>
      useQuery({
        queryKey: ["reports", "customers", organizationId, params],
        queryFn: () => ReportService.getCustomerReport(organizationId, params),
        enabled: !!organizationId && params.type === "customers",
      }),

    // Performance Reports
    usePerformanceReport: (params: ReportRequest) =>
      useQuery({
        queryKey: ["reports", "performance", organizationId, params],
        queryFn: () => ReportService.getPerformanceReport(organizationId, params),
        enabled: !!organizationId && params.type === "performance",
      }),

    // Generic Report Data
    useReportData: (type: string, params: ReportRequest) =>
      useQuery({
        queryKey: ["reports", type, organizationId, params],
        queryFn: () => ReportService.getReportData(organizationId, type, params),
        enabled: !!organizationId && !!type,
      }),

    // Export Mutation
    useExportReport: () =>
      useMutation({
        mutationFn: async (params: ReportRequest & { format: "csv" | "excel" | "pdf" }) => {
          const blob = await ReportService.exportReport(organizationId, params);
          const filename = `rapport-${params.type}-${new Date().toISOString().split('T')[0]}.${params.format}`;
          ReportService.downloadFile(blob, filename);
          return blob;
        },
        onSuccess: () => {
          toast.success("Rapport exporté avec succès");
        },
        onError: (error) => {
          console.error("Erreur lors de l'export:", error);
          toast.error("Erreur lors de l'export du rapport");
        },
      }),
  };
}

export function useSalesReport(organizationId: string, params: ReportRequest) {
  return useQuery({
    queryKey: ["reports", "sales", organizationId, params],
    queryFn: () => ReportService.getSalesReport(organizationId, params),
    enabled: !!organizationId,
  });
}

export function useStockReport(organizationId: string, params: ReportRequest) {
  return useQuery({
    queryKey: ["reports", "stock", organizationId, params],
    queryFn: () => ReportService.getStockReport(organizationId, params),
    enabled: !!organizationId,
  });
}

export function useMovementReport(organizationId: string, params: ReportRequest) {
  return useQuery({
    queryKey: ["reports", "movements", organizationId, params],
    queryFn: () => ReportService.getMovementReport(organizationId, params),
    enabled: !!organizationId,
  });
}

export function useProfitReport(organizationId: string, params: ReportRequest) {
  return useQuery({
    queryKey: ["reports", "profit", organizationId, params],
    queryFn: () => ReportService.getProfitReport(organizationId, params),
    enabled: !!organizationId,
  });
}

export function useCustomerReport(organizationId: string, params: ReportRequest) {
  return useQuery({
    queryKey: ["reports", "customers", organizationId, params],
    queryFn: () => ReportService.getCustomerReport(organizationId, params),
    enabled: !!organizationId,
  });
}

export function usePerformanceReport(organizationId: string, params: ReportRequest) {
  return useQuery({
    queryKey: ["reports", "performance", organizationId, params],
    queryFn: () => ReportService.getPerformanceReport(organizationId, params),
    enabled: !!organizationId,
  });
}

export function useExportReport(organizationId: string) {
  return useMutation({
    mutationFn: async (params: ReportRequest & { format: "csv" | "excel" | "pdf" }) => {
      const blob = await ReportService.exportReport(organizationId, params);
      const filename = `rapport-${params.type}-${new Date().toISOString().split('T')[0]}.${params.format}`;
      ReportService.downloadFile(blob, filename);
      return blob;
    },
    onSuccess: () => {
      toast.success("Rapport exporté avec succès");
    },
    onError: (error) => {
      console.error("Erreur lors de l'export:", error);
      toast.error("Erreur lors de l'export du rapport");
    },
  });
}