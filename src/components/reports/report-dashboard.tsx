"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ReportFilters } from "./report-filters";
import { ReportTabContent } from "./dashboard/ReportTabContent";
import { SalesReportComponent } from "./sales-report";
import { StockReportComponent } from "./stock-report";
import { MovementReportComponent } from "./movement-report";
import { ProfitReportComponent } from "./profit-report";
import { CustomerReportComponent } from "./customer-report";
import { ProductReportComponent } from "./product-report";
import { FinancialReportComponent } from "./financial-report";
import { PerformanceReportComponent } from "./performance-report";
import { useReports } from "@/hooks/use-reports";
import type { ReportRequest, ReportType, SalesReport, StockReport, MovementReport, ProfitReport, CustomerReport, ProductReport, FinancialReport, PerformanceReport } from "@/schema/report.schema";

interface ReportDashboardProps {
  organizationId: string;
}

export function ReportDashboard({ organizationId }: ReportDashboardProps) {
  const [filters, setFilters] = useState<ReportRequest>({
    type: "sales",
    period: "this_month",
    format: "json",
    includeDetails: true
  });

  const { useReportData, useExportReport } = useReports(organizationId);
  const exportMutation = useExportReport();
  const { data, isLoading, error } = useReportData(filters.type, filters);

  const handleFiltersChange = (newFilters: ReportRequest) => setFilters(newFilters);
  const handleExport = (format: "csv" | "excel" | "pdf") => exportMutation.mutate({ ...filters, format });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rapports</h1>
          <p className="text-muted-foreground">Analysez les performances de votre organisation</p>
        </div>
      </div>

      <ReportFilters onFiltersChange={handleFiltersChange} onExport={handleExport} isLoading={isLoading || exportMutation.isPending} />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Erreur lors du chargement du rapport: {error.message}</AlertDescription>
        </Alert>
      )}

      <Tabs value={filters.type} onValueChange={(value) => handleFiltersChange({ ...filters, type: value as ReportType })}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="sales">Ventes</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="movements">Mouvements</TabsTrigger>
          <TabsTrigger value="profit">Rentabilité</TabsTrigger>
          <TabsTrigger value="customers">Clients</TabsTrigger>
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <ReportTabContent isLoading={isLoading} hasData={!!data && filters.type === "sales"}>
            <SalesReportComponent data={data as SalesReport} isLoading={isLoading} />
          </ReportTabContent>
        </TabsContent>

        <TabsContent value="stock">
          <ReportTabContent isLoading={isLoading} hasData={!!data && filters.type === "stock"}>
            <StockReportComponent data={data as StockReport} isLoading={isLoading} />
          </ReportTabContent>
        </TabsContent>

        <TabsContent value="movements">
          <ReportTabContent isLoading={isLoading} hasData={!!data && filters.type === "movements"}>
            <MovementReportComponent data={data as MovementReport} isLoading={isLoading} />
          </ReportTabContent>
        </TabsContent>

        <TabsContent value="profit">
          <ReportTabContent isLoading={isLoading} hasData={!!data && filters.type === "profit"}>
            <ProfitReportComponent data={data as ProfitReport} isLoading={isLoading} />
          </ReportTabContent>
        </TabsContent>

        <TabsContent value="customers">
          <ReportTabContent isLoading={isLoading} hasData={!!data && filters.type === "customers"}>
            <CustomerReportComponent data={data as CustomerReport} isLoading={isLoading} />
          </ReportTabContent>
        </TabsContent>

        <TabsContent value="products">
          <ReportTabContent isLoading={isLoading} hasData={!!data && filters.type === "products"}>
            <ProductReportComponent data={data as ProductReport} isLoading={isLoading} />
          </ReportTabContent>
        </TabsContent>

        <TabsContent value="financial">
          <ReportTabContent isLoading={isLoading} hasData={!!data && filters.type === "financial"}>
            <FinancialReportComponent data={data as FinancialReport} isLoading={isLoading} />
          </ReportTabContent>
        </TabsContent>

        <TabsContent value="performance">
          <ReportTabContent isLoading={isLoading} hasData={!!data && filters.type === "performance"}>
            <PerformanceReportComponent data={data as PerformanceReport} isLoading={isLoading} />
          </ReportTabContent>
        </TabsContent>
      </Tabs>
    </div>
  );
}
