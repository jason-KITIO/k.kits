"use client";

import { useParams } from "next/navigation";
import {
  useLowStock,
  useStockOverview,
  useStockValue,
} from "@/hooks/use-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Package,
  TrendingUp,
  DollarSign,
  BarChart3,
  Eye,
  Plus,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const params = useParams();
  const organizationId = params.id as string;

  const { data: lowStock, isLoading: lowStockLoading } =
    useLowStock(organizationId);
  const { data: stockOverview, isLoading: overviewLoading } =
    useStockOverview(organizationId);
  const { data: stockValue, isLoading: valueLoading } =
    useStockValue(organizationId);

  if (lowStockLoading || overviewLoading || valueLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Chargement du tableau de bord...</span>
        </div>
      </div>
    );
  }

  const totalProducts = stockOverview?.length || 0;
  const lowStockCount = lowStock?.length || 0;
  const totalQuantity =
    stockOverview?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalValue = stockValue?.totalValue || 0;
  const lowStockPercentage =
    totalProducts > 0 ? (lowStockCount / totalProducts) * 100 : 0;

  return (
    <div className="space-y-8 p-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground mt-1">
            Vue d&apos;ensemble de votre inventaire et métriques clés
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/organizations/${organizationId}/reports/stock`}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Rapports
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={`/organizations/${organizationId}/products`}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter produit
            </Link>
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock faible</CardTitle>
            <div className="p-2 bg-destructive/10 rounded-full">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {lowStockCount}
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                Produits concernés
              </p>
              {totalProducts > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {lowStockPercentage.toFixed(1)}%
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total produits
            </CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-full">
              <Package className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalProducts}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Références actives
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Quantité totale
            </CardTitle>
            <div className="p-2 bg-green-500/10 rounded-full">
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalQuantity.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Unités en stock
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Valeur du stock
            </CardTitle>
            <div className="p-2 bg-amber-500/10 rounded-full">
              <DollarSign className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {totalValue.toLocaleString()} FCFA
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Valeur totale estimée
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sections détaillées */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Alertes stock faible
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Produits nécessitant un réapprovisionnement
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/organizations/${organizationId}/alerts/low-stock`}>
                <Eye className="h-4 w-4 mr-2" />
                Voir tout
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {lowStock && lowStock.length > 0 ? (
              <div className="space-y-4">
                {lowStock.slice(0, 5).map((item) => {
                  const stockPercentage =
                    item.product.minStock > 0
                      ? (item.quantity / item.product.minStock) * 100
                      : 0;
                  return (
                    <div key={item.productId} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.product.sku}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <Badge variant="destructive" className="text-xs">
                            {item.quantity} / {item.product.minStock}
                          </Badge>
                        </div>
                      </div>
                      <Progress
                        value={Math.min(stockPercentage, 100)}
                        className="h-2"
                      />
                    </div>
                  );
                })}
                {lowStock.length > 5 && (
                  <div className="text-center pt-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        href={`/organizations/${organizationId}/alerts/low-stock`}
                      >
                        Voir {lowStock.length - 5} autres produits
                        <ArrowUpRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  Aucun produit en stock faible
                </p>
                <p className="text-sm text-muted-foreground">
                  Excellent ! Votre stock est bien géré
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-500" />
                Aperçu du stock
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Produits avec les plus grandes quantités
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/organizations/${organizationId}/products`}>
                <Eye className="h-4 w-4 mr-2" />
                Voir tout
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stockOverview && stockOverview.length > 0 ? (
              <div className="space-y-4">
                {stockOverview
                  .sort((a, b) => b.quantity - a.quantity)
                  .slice(0, 5)
                  .map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between items-center p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.product.sku}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-semibold text-lg">
                          {item.quantity.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.product.unitPrice
                            ? `${(
                                item.product.unitPrice * item.quantity
                              ).toLocaleString()} FCFA`
                            : "Prix non défini"}
                        </p>
                      </div>
                    </div>
                  ))}
                {stockOverview.length > 5 && (
                  <div className="text-center pt-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/organizations/${organizationId}/products`}>
                        Voir {stockOverview.length - 5} autres produits
                        <ArrowUpRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Aucun produit en stock</p>
                <Button size="sm" asChild className="mt-2">
                  <Link href={`/organizations/${organizationId}/products`}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter votre premier produit
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
