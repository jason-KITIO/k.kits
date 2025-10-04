"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Target, Users, ShoppingCart, BarChart3, Zap } from "lucide-react";
import type { PerformanceReport } from "@/schema/report.schema";

interface PerformanceReportComponentProps {
  data: PerformanceReport;
  isLoading?: boolean;
}

export function PerformanceReportComponent({ data, isLoading }: PerformanceReportComponentProps) {
  if (isLoading) {
    return <div>Chargement...</div>;
  }

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up": return TrendingUp;
      case "down": return TrendingDown;
      default: return BarChart3;
    }
  };

  const getTrendColor = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up": return "text-green-500";
      case "down": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* KPIs de croissance */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Croissance des Ventes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${data.salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.salesGrowth >= 0 ? '+' : ''}{data.salesGrowth.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              vs période précédente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Croissance du CA</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${data.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.revenueGrowth >= 0 ? '+' : ''}{data.revenueGrowth.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Évolution du chiffre d'affaires
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Croissance Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${data.customerGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.customerGrowth >= 0 ? '+' : ''}{data.customerGrowth.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Nouveaux clients acquis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rotation Inventaire</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.inventoryTurnover.toFixed(1)}x</div>
            <p className="text-xs text-muted-foreground">
              Fois par période
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Métriques opérationnelles */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Métriques Opérationnelles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Panier Moyen</span>
                <div className="text-right">
                  <p className="font-medium">{data.averageOrderValue.toFixed(2)} €</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Taux de Conversion</span>
                <div className="text-right">
                  <p className="font-medium">{data.conversionRate.toFixed(1)}%</p>
                  <Progress value={data.conversionRate} className="w-20 h-2 mt-1" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Rotation des Stocks</span>
                <div className="text-right">
                  <p className="font-medium">{data.inventoryTurnover.toFixed(1)}x</p>
                  <Badge variant={data.inventoryTurnover >= 4 ? "default" : "secondary"}>
                    {data.inventoryTurnover >= 4 ? "Optimal" : "À améliorer"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Indicateurs de Croissance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Ventes</span>
                <div className="flex items-center gap-2">
                  <Badge variant={data.salesGrowth >= 0 ? "default" : "destructive"}>
                    {data.salesGrowth >= 0 ? '+' : ''}{data.salesGrowth.toFixed(1)}%
                  </Badge>
                  {data.salesGrowth >= 0 ? 
                    <TrendingUp className="h-4 w-4 text-green-500" /> : 
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  }
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Chiffre d'Affaires</span>
                <div className="flex items-center gap-2">
                  <Badge variant={data.revenueGrowth >= 0 ? "default" : "destructive"}>
                    {data.revenueGrowth >= 0 ? '+' : ''}{data.revenueGrowth.toFixed(1)}%
                  </Badge>
                  {data.revenueGrowth >= 0 ? 
                    <TrendingUp className="h-4 w-4 text-green-500" /> : 
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  }
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Base Clients</span>
                <div className="flex items-center gap-2">
                  <Badge variant={data.customerGrowth >= 0 ? "default" : "destructive"}>
                    {data.customerGrowth >= 0 ? '+' : ''}{data.customerGrowth.toFixed(1)}%
                  </Badge>
                  {data.customerGrowth >= 0 ? 
                    <TrendingUp className="h-4 w-4 text-green-500" /> : 
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPIs détaillés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Indicateurs Clés de Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.kpis.map((kpi, index) => {
              const TrendIcon = getTrendIcon(kpi.trend);
              const trendColor = getTrendColor(kpi.trend);
              
              return (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{kpi.name}</h4>
                    <TrendIcon className={`h-4 w-4 ${trendColor}`} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">{kpi.value.toLocaleString()}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={kpi.change >= 0 ? "default" : "destructive"} className="text-xs">
                        {kpi.change >= 0 ? '+' : ''}{kpi.change.toFixed(1)}%
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {kpi.trend === "up" ? "En hausse" : kpi.trend === "down" ? "En baisse" : "Stable"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Résumé de performance */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé de Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-medium text-green-600">Points Forts</h4>
              <div className="space-y-2">
                {data.salesGrowth > 0 && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Croissance des ventes positive</span>
                  </div>
                )}
                {data.revenueGrowth > 0 && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Augmentation du chiffre d'affaires</span>
                  </div>
                )}
                {data.customerGrowth > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Acquisition de nouveaux clients</span>
                  </div>
                )}
                {data.inventoryTurnover >= 4 && (
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Rotation des stocks optimale</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-red-600">Points d'Amélioration</h4>
              <div className="space-y-2">
                {data.salesGrowth < 0 && (
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Baisse des ventes à analyser</span>
                  </div>
                )}
                {data.conversionRate < 5 && (
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Taux de conversion à améliorer</span>
                  </div>
                )}
                {data.inventoryTurnover < 4 && (
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Rotation des stocks lente</span>
                  </div>
                )}
                {data.customerGrowth < 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Perte de clients à investiguer</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}