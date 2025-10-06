"use client";

import type { MovementReport } from "@/schema/report.schema";
import { CustomerReportLoading } from "./customer/CustomerReportLoading";
import { MovementKPIs } from "./movement/MovementKPIs";
import { MovementsByTypeTable } from "./movement/MovementsByTypeTable";
import { TopMovedProductsTable } from "./movement/TopMovedProductsTable";
import { MovementEvolutionTable } from "./movement/MovementEvolutionTable";

interface MovementReportProps {
  data: MovementReport;
  isLoading?: boolean;
}

export function MovementReportComponent({ data, isLoading }: MovementReportProps) {
  if (isLoading) return <CustomerReportLoading />;

  const totalQuantity = data.movementsByType.reduce((sum, type) => sum + type.quantity, 0);

  return (
    <div className="space-y-6">
      <MovementKPIs
        totalMovements={data.totalMovements}
        typesCount={data.movementsByType.length}
        productsCount={data.topMovedProducts.length}
        totalQuantity={totalQuantity}
      />
      <MovementsByTypeTable movements={data.movementsByType} totalMovements={data.totalMovements} />
      <TopMovedProductsTable products={data.topMovedProducts} />
      <MovementEvolutionTable periods={data.movementsByPeriod} />
    </div>
  );
}
