"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportFilters } from "./report-filters";
import { SalesReportComponent } from "./sales-report";
import { StockReportComponent } from "./stock-report";
import { MovementReportComponent } from "./movement-report";
import { ProfitReportComponent } from "./profit-report";
import { CustomerReportComponent } from "./customer-report";
import { ProductReportComponent } from "./product-report";
import { FinancialReportComponent } from "./financial-report";
import { PerformanceReportComponent } from "./performance-report";
import { useReports } from "@/hooks/use-reports";
import type { 
  ReportRequest, 
  ReportType,
  SalesReport,
  StockReport,
  MovementReport,
  ProfitReport,
  CustomerReport,
  ProductReport,
  FinancialReport,
  PerformanceReport
} from "@/schema/report.schema";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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

  const handleFiltersChange = (newFilters: ReportRequest) => {
    setFilters(newFilters);
  };

  const handleExport = (format: "csv" | "excel" | "pdf") => {
    exportMutation.mutate({
      ...filters,
      format
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rapports</h1>
          <p className="text-muted-foreground">
            Analysez les performances de votre organisation
          </p>
        </div>
      </div>

      <ReportFilters
        onFiltersChange={handleFiltersChange}
        onExport={handleExport}
        isLoading={isLoading || exportMutation.isPending}
      />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erreur lors du chargement du rapport: {error.message}
          </AlertDescription>
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
          {/* <TabsTrigger value="financial">Financier</TabsTrigger> */}
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : data && filters.type === "sales" ? (
            <SalesReportComponent data={data as SalesReport} isLoading={isLoading} />
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  Aucune donnée disponible pour cette période
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="stock" className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : data && filters.type === "stock" ? (
            <StockReportComponent data={data as StockReport} isLoading={isLoading} />
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  Aucune donnée disponible
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : data && filters.type === "movements" ? (
            <MovementReportComponent data={data as MovementReport} isLoading={isLoading} />
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  Aucune donnée disponible
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="profit" className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : data && filters.type === "profit" ? (
            <ProfitReportComponent data={data as ProfitReport} isLoading={isLoading} />
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  Aucune donnée disponible
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : data && filters.type === "customers" ? (
            <CustomerReportComponent data={data as CustomerReport} isLoading={isLoading} />
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  Aucune donnée disponible
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : data && filters.type === "products" ? (
            <ProductReportComponent data={data as ProductReport} isLoading={isLoading} />
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  Aucune donnée disponible
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : data && filters.type === "financial" ? (
            <FinancialReportComponent data={data as FinancialReport} isLoading={isLoading} />
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  Aucune donnée disponible
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : data && filters.type === "performance" ? (
            <PerformanceReportComponent data={data as PerformanceReport} isLoading={isLoading} />
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  Aucune donnée disponible
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}