"use client";

import type { CustomerReport } from "@/schema/report.schema";
import { CustomerReportLoading } from "./customer/CustomerReportLoading";
import { CustomerKPIs } from "./customer/CustomerKPIs";
import { TopCustomersTable } from "./customer/TopCustomersTable";
import { CustomerEvolutionTable } from "./customer/CustomerEvolutionTable";
import { CustomerSegmentation } from "./customer/CustomerSegmentation";

interface CustomerReportProps {
  data: CustomerReport;
  isLoading?: boolean;
}

export function CustomerReportComponent({ data, isLoading }: CustomerReportProps) {
  if (isLoading) return <CustomerReportLoading />;

  return (
    <div className="space-y-6">
      <CustomerKPIs
        totalCustomers={data.totalCustomers}
        newCustomers={data.newCustomers}
        returningCustomers={data.returningCustomers}
      />
      <TopCustomersTable customers={data.topCustomers.map(c => ({ ...c, lastOrderDate: c.lastOrderDate ? new Date(c.lastOrderDate) : null }))} />
      <CustomerEvolutionTable periods={data.customersByPeriod} />
      <CustomerSegmentation customers={data.topCustomers.map(c => ({ ...c, lastOrderDate: c.lastOrderDate ? new Date(c.lastOrderDate) : null }))} />
    </div>
  );
}