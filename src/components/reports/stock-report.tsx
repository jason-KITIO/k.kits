"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package, AlertTriangle, DollarSign, BarChart3 } from "lucide-react";
import type { StockReport } from "@/schema/report.schema";

interface StockReportProps {
  data: StockReport;
  isLoading?: boolean;
}

export function StockReportComponent({ data, isLoading }: StockReportProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-24 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-32 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits en stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Références actives
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur du stock</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XAF'
              }).format(data.totalStockValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Valeur totale
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes stock bas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {data.lowStockItems.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Produits en rupture
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Catégories</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stockByCategory.length}</div>
            <p className="text-xs text-muted-foreground">
              Catégories actives
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertes stock bas */}
      {data.lowStockItems.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{data.lowStockItems.length} produit(s)</strong> ont un stock inférieur au seuil minimum.
          </AlertDescription>
        </Alert>
      )}

      {/* Produits en stock bas */}
      {data.lowStockItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Produits en stock bas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead className="text-right">Stock actuel</TableHead>
                  <TableHead className="text-right">Stock minimum</TableHead>
                  <TableHead className="text-right">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.lowStockItems.map((item) => (
                  <TableRow key={`${item.productId}-${item.location}`}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell className="text-right">{item.currentStock}</TableCell>
                    <TableCell className="text-right">{item.minStock}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={item.currentStock === 0 ? "destructive" : "secondary"}>
                        {item.currentStock === 0 ? "Rupture" : "Stock bas"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Stock par catégorie */}
      <Card>
        <CardHeader>
          <CardTitle>Stock par catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-right">Quantité totale</TableHead>
                <TableHead className="text-right">Valeur</TableHead>
                <TableHead className="text-right">% du stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.stockByCategory.map((category) => (
                <TableRow key={category.categoryId}>
                  <TableCell className="font-medium">{category.categoryName}</TableCell>
                  <TableCell className="text-right">{category.totalQuantity}</TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'XAF'
                    }).format(category.totalValue)}
                  </TableCell>
                  <TableCell className="text-right">
                    {data.totalStockValue > 0 
                      ? ((category.totalValue / data.totalStockValue) * 100).toFixed(1)
                      : 0}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stock par localisation */}
      <Card>
        <CardHeader>
          <CardTitle>Stock par localisation</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Localisation</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Quantité totale</TableHead>
                <TableHead className="text-right">Valeur</TableHead>
                <TableHead className="text-right">% du stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.stockByLocation.map((location) => (
                <TableRow key={location.locationId}>
                  <TableCell className="font-medium">{location.locationName}</TableCell>
                  <TableCell>
                    <Badge variant={location.locationType === "store" ? "default" : "secondary"}>
                      {location.locationType === "store" ? "Boutique" : "Entrepôt"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{location.totalQuantity}</TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'XAF'
                    }).format(location.totalValue)}
                  </TableCell>
                  <TableCell className="text-right">
                    {data.totalStockValue > 0 
                      ? ((location.totalValue / data.totalStockValue) * 100).toFixed(1)
                      : 0}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}