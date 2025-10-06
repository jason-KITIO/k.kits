"use client";

import type { FinancialReport } from "@/schema/report.schema";
import { FinancialKPIs } from "./financial/FinancialKPIs";
import { ProfitabilityMetrics } from "./financial/ProfitabilityMetrics";
import { FinancialRatios } from "./financial/FinancialRatios";
import { CashFlowAnalysis } from "./financial/CashFlowAnalysis";
import { ExpensesByCategory } from "./financial/ExpensesByCategory";
import { RevenueEvolution } from "./financial/RevenueEvolution";

interface FinancialReportComponentProps {
  data: FinancialReport;
  isLoading?: boolean;
}

export function FinancialReportComponent({ data, isLoading }: FinancialReportComponentProps) {
  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="space-y-6">
      <FinancialKPIs
        totalRevenue={data.totalRevenue}
        grossMargin={data.grossMargin}
        totalExpenses={data.totalExpenses}
        operatingMargin={data.operatingMargin}
        netIncome={data.netIncome}
        cashFlowNet={data.cashFlow.net}
        cashFlowOperating={data.cashFlow.operating}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <ProfitabilityMetrics metrics={data.profitabilityMetrics} />
        <FinancialRatios ratios={data.financialRatios} />
      </div>
      <CashFlowAnalysis cashFlow={data.cashFlow} />
      <ExpensesByCategory expenses={data.expensesByCategory} />
      <RevenueEvolution periods={data.revenueByPeriod} />
    </div>
  );
}
