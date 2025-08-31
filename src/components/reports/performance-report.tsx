"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePerformanceReport } from "@/hooks/use-reports";
import { Package, TrendingUp, AlertTriangle, BarChart3 } from "lucide-react";

interface PerformanceReportProps {
  organizationId: string;
}

export function PerformanceReport({ organizationId }: PerformanceReportProps) {
  const { data: performance, isLoading } = usePerformanceReport(organizationId);

  if (isLoading) return <div>Chargement du rapport de performance...</div>;

  if (!performance) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Rapport de performance</h2>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              Aucune donnée de performance disponible
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Rapport de performance</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total produits
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performance.totalProducts}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur totale</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performance.totalStockValue.toLocaleString()} FCFA
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock bas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {performance.lowStockItems}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ruptures</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {performance.outOfStockItems}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mouvements</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performance.totalMovements}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top produits</CardTitle>
          </CardHeader>
          <CardContent>
            {performance.topProducts.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Aucune donnée disponible
              </p>
            ) : (
              <div className="space-y-3">
                {performance.topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div>
                      <span className="font-medium">{product.productName}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({product.sku})
                      </span>
                    </div>
                    <div className="text-right text-sm">
                      <div>{product.totalMovements} mouvements</div>
                      <div className="text-muted-foreground">
                        {product.stockValue.toLocaleString()} FCFA
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendances mensuelles</CardTitle>
          </CardHeader>
          <CardContent>
            {performance.monthlyTrends.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Aucune donnée disponible
              </p>
            ) : (
              <div className="space-y-3">
                {performance.monthlyTrends.map((trend, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div className="font-medium">{trend.month}</div>
                    <div className="flex space-x-4 text-sm">
                      <div className="text-green-600">
                        Entrées: {trend.stockIn}
                      </div>
                      <div className="text-red-600">
                        Sorties: {trend.stockOut}
                      </div>
                      <div className="text-orange-600">
                        Ajustements: {trend.adjustments}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
