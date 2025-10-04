"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Package, TrendingUp, TrendingDown, AlertTriangle, BarChart3 } from "lucide-react";
import type { ProductReport } from "@/schema/report.schema";

interface ProductReportComponentProps {
  data: ProductReport;
  isLoading?: boolean;
}

export function ProductReportComponent({ data, isLoading }: ProductReportComponentProps) {
  if (isLoading) {
    return <div>Chargement...</div>;
  }

  const stockHealthPercentage = ((data.activeProducts - data.outOfStockProducts) / data.totalProducts) * 100;
  const lowStockPercentage = (data.lowStockProducts / data.totalProducts) * 100;

  return (
    <div className="space-y-6">
      {/* KPIs principaux */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {data.activeProducts} actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Santé du Stock</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockHealthPercentage.toFixed(1)}%</div>
            <Progress value={stockHealthPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Faible</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{data.lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">
              {lowStockPercentage.toFixed(1)}% du catalogue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rupture de Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{data.outOfStockProducts}</div>
            <p className="text-xs text-muted-foreground">
              Nécessite réapprovisionnement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analyse du stock */}
      <Card>
        <CardHeader>
          <CardTitle>Analyse du Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium">Valeur Totale du Stock</p>
              <p className="text-2xl font-bold">{data.stockAnalysis.totalStockValue.toLocaleString()} €</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Niveau Moyen de Stock</p>
              <p className="text-2xl font-bold">{data.stockAnalysis.averageStockLevel.toFixed(0)} unités</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Taux de Rotation</p>
              <p className="text-2xl font-bold">{data.stockAnalysis.stockTurnoverRate.toFixed(1)}x</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top produits vendeurs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Top Produits Vendeurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topSellingProducts.slice(0, 10).map((product, index) => (
                <div key={product.productId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">{product.productName}</p>
                      <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                      {product.category && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {product.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{product.quantitySold} vendus</p>
                    <p className="text-sm text-muted-foreground">{product.revenue.toLocaleString()} €</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Produits peu performants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              Produits Peu Performants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.lowPerformingProducts.slice(0, 10).map((product, index) => (
                <div key={product.productId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="destructive" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">{product.productName}</p>
                      <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          Stock: {product.stockLevel}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {product.daysSinceLastSale}j sans vente
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-600">{product.quantitySold} vendus</p>
                    <p className="text-xs text-muted-foreground">Faible rotation</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analyse par catégorie */}
      <Card>
        <CardHeader>
          <CardTitle>Performance par Catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.productsByCategory.map((category) => (
              <div key={category.categoryId} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">{category.categoryName}</p>
                    <p className="text-sm text-muted-foreground">
                      {category.productCount} produits
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{category.totalRevenue.toLocaleString()} €</p>
                  <p className="text-sm text-muted-foreground">
                    Prix moyen: {category.averagePrice.toFixed(2)} €
                  </p>
                </div>
                <div className="w-24">
                  <Progress 
                    value={(category.totalRevenue / Math.max(...data.productsByCategory.map(c => c.totalRevenue))) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}