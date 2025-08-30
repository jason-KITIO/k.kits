"use client";

import { useParams } from "next/navigation";
import { useLowStock, useStockOverview, useStockValue } from "@/hooks/use-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Package, TrendingUp, DollarSign } from "lucide-react";

export default function DashboardPage() {
  const params = useParams();
  const organizationId = params.id as string;

  const { data: lowStock, isLoading: lowStockLoading } = useLowStock(organizationId);
  const { data: stockOverview, isLoading: overviewLoading } = useStockOverview(organizationId);
  const { data: stockValue, isLoading: valueLoading } = useStockValue(organizationId);

  if (lowStockLoading || overviewLoading || valueLoading) {
    return <div className="p-6">Chargement du tableau de bord...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits en stock faible</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStock?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Nécessitent une attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total produits</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockOverview?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Produits en stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quantité totale</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stockOverview?.reduce((sum, item) => sum + item.quantity, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">Unités en stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur du stock</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockValue?.totalValue || "0.00"} FCFA</div>
            <p className="text-xs text-muted-foreground">Valeur totale</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Produits en stock faible</CardTitle>
          </CardHeader>
          <CardContent>
            {lowStock && lowStock.length > 0 ? (
              <div className="space-y-2">
                {lowStock.slice(0, 5).map((item) => (
                  <div key={item.productId} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">{item.product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-destructive">{item.quantity}</p>
                      <p className="text-xs text-muted-foreground">Min: {item.product.minStock}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucun produit en stock faible</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aperçu du stock</CardTitle>
          </CardHeader>
          <CardContent>
            {stockOverview && stockOverview.length > 0 ? (
              <div className="space-y-2">
                {stockOverview.slice(0, 5).map((item) => (
                  <div key={item.productId} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">{item.product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item.quantity}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.product.unitPrice ? `${item.product.unitPrice} FCFA/u` : "N/A"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucun produit en stock</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
