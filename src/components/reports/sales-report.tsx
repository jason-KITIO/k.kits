"use client";

import type { SalesReport } from "@/schema/report.schema";
import { CustomerReportLoading } from "./customer/CustomerReportLoading";
import { SalesKPIs } from "./sales/SalesKPIs";
import { TopProductsTable } from "./sales/TopProductsTable";
import { SalesByStoreTable } from "./sales/SalesByStoreTable";

interface SalesReportProps {
  data: SalesReport;
  isLoading?: boolean;
}

export function SalesReportComponent({ data, isLoading }: SalesReportProps) {
  if (isLoading) return <CustomerReportLoading />;

  return (
    <div className="space-y-6">
      <SalesKPIs
        totalSales={data.totalSales}
        totalRevenue={data.totalRevenue}
        averageOrderValue={data.averageOrderValue}
        salesCount={data.salesCount}
      />
      <TopProductsTable products={data.topProducts} />
      <SalesByStoreTable stores={data.salesByStore} />
    </div>
  );
}
