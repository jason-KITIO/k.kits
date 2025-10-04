import { api } from "./api";
import type { 
  ReportRequest, 
  SalesReport, 
  StockReport, 
  MovementReport, 
  ProfitReport,
  CustomerReport,
  PerformanceReport 
} from "@/schema/report.schema";

export class ReportService {
  private static baseUrl = "/organization";

  static async getSalesReport(
    organizationId: string, 
    params: ReportRequest
  ): Promise<SalesReport> {
    return api.get<SalesReport>(
      `${this.baseUrl}/${organizationId}/reports/sales`,
      { params }
    );
  }

  static async getStockReport(
    organizationId: string,
    params: ReportRequest
  ): Promise<StockReport> {
    return api.get<StockReport>(
      `${this.baseUrl}/${organizationId}/reports/stock`,
      { params }
    );
  }

  static async getMovementReport(
    organizationId: string,
    params: ReportRequest
  ): Promise<MovementReport> {
    return api.get<MovementReport>(
      `${this.baseUrl}/${organizationId}/reports/movements`,
      { params }
    );
  }

  static async getProfitReport(
    organizationId: string,
    params: ReportRequest
  ): Promise<ProfitReport> {
    return api.get<ProfitReport>(
      `${this.baseUrl}/${organizationId}/reports/profit`,
      { params }
    );
  }

  static async getCustomerReport(
    organizationId: string,
    params: ReportRequest
  ): Promise<CustomerReport> {
    return api.get<CustomerReport>(
      `${this.baseUrl}/${organizationId}/reports/customers`,
      { params }
    );
  }

  static async getPerformanceReport(
    organizationId: string,
    params: ReportRequest
  ): Promise<PerformanceReport> {
    return api.get<PerformanceReport>(
      `${this.baseUrl}/${organizationId}/reports/performance`,
      { params }
    );
  }

  static async exportReport(
    organizationId: string,
    params: ReportRequest & { format: "csv" | "excel" | "pdf" }
  ): Promise<Blob> {
    return api.get<Blob>(
      `${this.baseUrl}/${organizationId}/reports/export`,
      { 
        params,
        responseType: "blob"
      }
    );
  }

  static async getReportData(
    organizationId: string,
    type: string,
    params: ReportRequest
  ) {
    return api.get(
      `${this.baseUrl}/${organizationId}/reports`,
      { 
        params: { 
          ...params,
          type
        }
      }
    );
  }

  static downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}