"use client";

import type { StockReport } from "@/schema/report.schema";
import { StockReportLoading } from "./stock/StockReportLoading";
import { StockKPIs } from "./stock/StockKPIs";
import { LowStockAlert } from "./stock/LowStockAlert";
import { LowStockTable } from "./stock/LowStockTable";
import { StockByCategoryTable } from "./stock/StockByCategoryTable";
import { StockByLocationTable } from "./stock/StockByLocationTable";

interface StockReportProps {
  data: StockReport;
  isLoading?: boolean;
}

export function StockReportComponent({ data, isLoading }: StockReportProps) {
  if (isLoading) return <StockReportLoading />;

  return (
    <div className="space-y-6">
      <StockKPIs
        totalProducts={data.totalProducts}
        totalStockValue={data.totalStockValue}
        lowStockCount={data.lowStockItems.length}
        categoryCount={data.stockByCategory.length}
      />
      <LowStockAlert count={data.lowStockItems.length} />
      <LowStockTable items={data.lowStockItems} />
      <StockByCategoryTable categories={data.stockByCategory} totalStockValue={data.totalStockValue} />
      <StockByLocationTable locations={data.stockByLocation} totalStockValue={data.totalStockValue} />
    </div>
  );
}
