"use client";

import type { ProductReport } from "@/schema/report.schema";
import { ProductKPIs } from "./product/ProductKPIs";
import { StockAnalysis } from "./product/StockAnalysis";
import { TopSellingProducts } from "./product/TopSellingProducts";
import { LowPerformingProducts } from "./product/LowPerformingProducts";
import { CategoryPerformance } from "./product/CategoryPerformance";

interface ProductReportComponentProps {
  data: ProductReport;
  isLoading?: boolean;
}

export function ProductReportComponent({ data, isLoading }: ProductReportComponentProps) {
  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="space-y-6">
      <ProductKPIs
        totalProducts={data.totalProducts}
        activeProducts={data.activeProducts}
        lowStockProducts={data.lowStockProducts}
        outOfStockProducts={data.outOfStockProducts}
      />
      <StockAnalysis data={data.stockAnalysis} />
      <div className="grid gap-6 lg:grid-cols-2">
        <TopSellingProducts products={data.topSellingProducts} />
        <LowPerformingProducts products={data.lowPerformingProducts} />
      </div>
      <CategoryPerformance categories={data.productsByCategory} />
    </div>
  );
}
