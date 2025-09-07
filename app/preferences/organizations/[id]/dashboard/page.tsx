"use client";

import { useParams } from "next/navigation";
import { useOrganizationDashboard, useStockAlerts } from "@/hooks/useOrganization";
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

  const { data: dashboard, isLoading: dashboardLoading } = useOrganizationDashboard(organizationId);
  const { data: stockAlerts, isLoading: alertsLoading } = useStockAlerts(organizationId);

  if (dashboardLoading || alertsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Chargement du tableau de bord...</span>
        </div>
      </div>
    );
  }

  const totalProducts = dashboard?.overview.totalProducts || 0;
  const totalStores = dashboard?.overview.totalStores || 0;
  const totalWarehouses = dashboard?.overview.totalWarehouses || 0;
  const lowStockCount = dashboard?.overview.lowStockProducts || 0;
  const todaySales = dashboard?.sales.todayAmount || 0;
  const todayCount = dashboard?.sales.todayCount || 0;
  const totalValue = dashboard?.stock.totalValue || 0;
  const lowStockPercentage = totalProducts > 0 ? (lowStockCount / totalProducts) * 100 : 0;

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
              Boutiques
            </CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-full">
              <Package className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalStores}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Points de vente
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ventes aujourd'hui
            </CardTitle>
            <div className="p-2 bg-green-500/10 rounded-full">
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {todayCount}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {todaySales.toLocaleString()} FCFA
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
              <Link href={`/preferences/organizations/${organizationId}/stock-alerts`}>
                <Eye className="h-4 w-4 mr-2" />
                Voir tout
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stockAlerts && stockAlerts.length > 0 ? (
              <div className="space-y-4">
                {stockAlerts.slice(0, 5).map((item) => {
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
                {stockAlerts.length > 5 && (
                  <div className="text-center pt-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        href={`/organizations/${organizationId}/alerts/low-stock`}
                      >
                        Voir {stockAlerts.length - 5} autres produits
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
                Activité récente
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Derniers mouvements de stock
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/preferences/organizations/${organizationId}/stores`}>
                <Eye className="h-4 w-4 mr-2" />
                Voir tout
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {dashboard?.recentActivity && dashboard.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {dashboard.recentActivity
                  .slice(0, 5)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.type} - {item.quantity > 0 ? '+' : ''}{item.quantity}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.user.firstName} {item.user.lastName}
                        </p>
                      </div>
                    </div>
                  ))}
                {dashboard.recentActivity.length > 5 && (
                  <div className="text-center pt-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/organizations/${organizationId}/stock-movements`}>
                        Voir {dashboard.recentActivity.length - 5} autres mouvements
                        <ArrowUpRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Aucune activité récente</p>
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
