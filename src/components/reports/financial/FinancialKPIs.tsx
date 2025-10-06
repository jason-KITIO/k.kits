"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Euro, TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";

interface FinancialKPIsProps {
  totalRevenue: number;
  grossMargin: number;
  totalExpenses: number;
  operatingMargin: number;
  netIncome: number;
  cashFlowNet: number;
  cashFlowOperating: number;
}

export function FinancialKPIs({ totalRevenue, grossMargin, totalExpenses, operatingMargin, netIncome, cashFlowNet, cashFlowOperating }: FinancialKPIsProps) {
  const ProfitIcon = netIncome >= 0 ? TrendingUp : TrendingDown;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
          <Euro className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} €</div>
          <p className="text-xs text-muted-foreground">Marge brute: {grossMargin.toFixed(1)}%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dépenses Totales</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{totalExpenses.toLocaleString()} €</div>
          <p className="text-xs text-muted-foreground">Marge opérationnelle: {operatingMargin.toFixed(1)}%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Résultat Net</CardTitle>
          <ProfitIcon className={`h-4 w-4 ${netIncome >= 0 ? 'text-green-500' : 'text-red-500'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {netIncome.toLocaleString()} €
          </div>
          <p className="text-xs text-muted-foreground">{netIncome >= 0 ? 'Bénéfice' : 'Perte'}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Flux de Trésorerie Net</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${cashFlowNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {cashFlowNet.toLocaleString()} €
          </div>
          <p className="text-xs text-muted-foreground">Flux opérationnel: {cashFlowOperating.toLocaleString()} €</p>
        </CardContent>
      </Card>
    </div>
  );
}
