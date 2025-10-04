"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Euro, TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3 } from "lucide-react";
import type { FinancialReport } from "@/schema/report.schema";

interface FinancialReportComponentProps {
  data: FinancialReport;
  isLoading?: boolean;
}

export function FinancialReportComponent({ data, isLoading }: FinancialReportComponentProps) {
  if (isLoading) {
    return <div>Chargement...</div>;
  }

  const profitColor = data.netIncome >= 0 ? "text-green-600" : "text-red-600";
  const profitIcon = data.netIncome >= 0 ? TrendingUp : TrendingDown;
  const ProfitIcon = profitIcon;

  return (
    <div className="space-y-6">
      {/* KPIs financiers principaux */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalRevenue.toLocaleString()} €</div>
            <p className="text-xs text-muted-foreground">
              Marge brute: {data.grossMargin.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dépenses Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{data.totalExpenses.toLocaleString()} €</div>
            <p className="text-xs text-muted-foreground">
              Marge opérationnelle: {data.operatingMargin.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Résultat Net</CardTitle>
            <ProfitIcon className={`h-4 w-4 ${data.netIncome >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profitColor}`}>{data.netIncome.toLocaleString()} €</div>
            <p className="text-xs text-muted-foreground">
              {data.netIncome >= 0 ? 'Bénéfice' : 'Perte'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flux de Trésorerie Net</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${data.cashFlow.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.cashFlow.net.toLocaleString()} €
            </div>
            <p className="text-xs text-muted-foreground">
              Flux opérationnel: {data.cashFlow.operating.toLocaleString()} €
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Métriques de rentabilité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Métriques de Rentabilité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">ROI (Retour sur Investissement)</span>
                <Badge variant={data.profitabilityMetrics.roi >= 0 ? "default" : "destructive"}>
                  {data.profitabilityMetrics.roi.toFixed(1)}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">ROA (Retour sur Actifs)</span>
                <Badge variant={data.profitabilityMetrics.roa >= 0 ? "default" : "destructive"}>
                  {data.profitabilityMetrics.roa.toFixed(1)}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Marge Bénéficiaire Brute</span>
                <Badge variant="secondary">
                  {data.profitabilityMetrics.grossProfitMargin.toFixed(1)}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Marge Bénéficiaire Nette</span>
                <Badge variant={data.profitabilityMetrics.netProfitMargin >= 0 ? "default" : "destructive"}>
                  {data.profitabilityMetrics.netProfitMargin.toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ratios financiers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-blue-500" />
              Ratios Financiers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Ratio de Liquidité Générale</span>
                <Badge variant={data.financialRatios.currentRatio >= 1 ? "default" : "destructive"}>
                  {data.financialRatios.currentRatio.toFixed(2)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Ratio de Liquidité Réduite</span>
                <Badge variant={data.financialRatios.quickRatio >= 1 ? "default" : "destructive"}>
                  {data.financialRatios.quickRatio.toFixed(2)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Ratio Dette/Capitaux Propres</span>
                <Badge variant={data.financialRatios.debtToEquity <= 1 ? "default" : "secondary"}>
                  {data.financialRatios.debtToEquity.toFixed(2)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Rotation des Stocks</span>
                <Badge variant="secondary">
                  {data.financialRatios.inventoryTurnover.toFixed(1)}x
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flux de trésorerie détaillé */}
      <Card>
        <CardHeader>
          <CardTitle>Analyse des Flux de Trésorerie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Flux Opérationnel</p>
              <p className={`text-2xl font-bold ${data.cashFlow.operating >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.cashFlow.operating.toLocaleString()} €
              </p>
              <p className="text-xs text-muted-foreground">Activités principales</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Flux d'Investissement</p>
              <p className={`text-2xl font-bold ${data.cashFlow.investing >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.cashFlow.investing.toLocaleString()} €
              </p>
              <p className="text-xs text-muted-foreground">Investissements</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Flux de Financement</p>
              <p className={`text-2xl font-bold ${data.cashFlow.financing >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.cashFlow.financing.toLocaleString()} €
              </p>
              <p className="text-xs text-muted-foreground">Financement</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Flux Net</p>
              <p className={`text-2xl font-bold ${data.cashFlow.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.cashFlow.net.toLocaleString()} €
              </p>
              <p className="text-xs text-muted-foreground">Variation totale</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dépenses par catégorie */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition des Dépenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.expensesByCategory.map((expense, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">{expense.category}</p>
                    <p className="text-sm text-muted-foreground">
                      {expense.percentage.toFixed(1)}% du total
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{expense.amount.toLocaleString()} €</p>
                </div>
                <div className="w-24">
                  <Progress value={expense.percentage} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Évolution financière */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution Financière par Période</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.revenueByPeriod.map((period, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge variant="outline">{period.period}</Badge>
                  <div>
                    <p className="font-medium">Revenus: {period.revenue.toLocaleString()} €</p>
                    <p className="text-sm text-muted-foreground">
                      Dépenses: {period.expenses.toLocaleString()} €
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${period.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {period.profit >= 0 ? '+' : ''}{period.profit.toLocaleString()} €
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {period.profit >= 0 ? 'Bénéfice' : 'Perte'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}