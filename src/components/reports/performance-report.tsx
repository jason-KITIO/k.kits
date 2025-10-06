"use client";

import type { PerformanceReport } from "@/schema/report.schema";
import { GrowthKPIs } from "./performance/GrowthKPIs";
import { OperationalMetrics } from "./performance/OperationalMetrics";
import { GrowthIndicators } from "./performance/GrowthIndicators";
import { KPIGrid } from "./performance/KPIGrid";
import { PerformanceSummary } from "./performance/PerformanceSummary";

interface PerformanceReportComponentProps {
  data: PerformanceReport;
  isLoading?: boolean;
}

export function PerformanceReportComponent({ data, isLoading }: PerformanceReportComponentProps) {
  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="space-y-6">
      <GrowthKPIs
        salesGrowth={data.salesGrowth}
        revenueGrowth={data.revenueGrowth}
        customerGrowth={data.customerGrowth}
        inventoryTurnover={data.inventoryTurnover}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <OperationalMetrics
          averageOrderValue={data.averageOrderValue}
          conversionRate={data.conversionRate}
          inventoryTurnover={data.inventoryTurnover}
        />
        <GrowthIndicators
          salesGrowth={data.salesGrowth}
          revenueGrowth={data.revenueGrowth}
          customerGrowth={data.customerGrowth}
        />
      </div>
      <KPIGrid kpis={data.kpis} />
      <PerformanceSummary
        salesGrowth={data.salesGrowth}
        revenueGrowth={data.revenueGrowth}
        customerGrowth={data.customerGrowth}
        inventoryTurnover={data.inventoryTurnover}
        conversionRate={data.conversionRate}
      />
    </div>
  );
}