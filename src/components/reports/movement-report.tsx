"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, TrendingUp, Package, Users } from "lucide-react";
import type { MovementReport } from "@/schema/report.schema";

interface MovementReportProps {
  data: MovementReport;
  isLoading?: boolean;
}

export function MovementReportComponent({ data, isLoading }: MovementReportProps) {
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

  const getMovementTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'IN': return 'bg-green-100 text-green-800';
      case 'OUT': return 'bg-red-100 text-red-800';
      case 'TRANSFER': return 'bg-blue-100 text-blue-800';
      case 'ADJUSTMENT': return 'bg-yellow-100 text-yellow-800';
      case 'SALE': return 'bg-purple-100 text-purple-800';
      case 'PURCHASE': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMovementTypeLabel = (type: string) => {
    switch (type.toUpperCase()) {
      case 'IN': return 'Entrée';
      case 'OUT': return 'Sortie';
      case 'TRANSFER': return 'Transfert';
      case 'ADJUSTMENT': return 'Ajustement';
      case 'SALE': return 'Vente';
      case 'PURCHASE': return 'Achat';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mouvements totaux</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalMovements}</div>
            <p className="text-xs text-muted-foreground">
              Tous types confondus
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Types de mouvements</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.movementsByType.length}</div>
            <p className="text-xs text-muted-foreground">
              Catégories différentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits concernés</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.topMovedProducts.length}</div>
            <p className="text-xs text-muted-foreground">
              Références actives
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quantité totale</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.movementsByType.reduce((sum, type) => sum + type.quantity, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Unités déplacées
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Mouvements par type */}
      <Card>
        <CardHeader>
          <CardTitle>Mouvements par type</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Nombre</TableHead>
                <TableHead className="text-right">Quantité</TableHead>
                <TableHead className="text-right">% du total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.movementsByType.map((movement) => (
                <TableRow key={movement.type}>
                  <TableCell>
                    <Badge className={getMovementTypeColor(movement.type)}>
                      {getMovementTypeLabel(movement.type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{movement.count}</TableCell>
                  <TableCell className="text-right">{movement.quantity}</TableCell>
                  <TableCell className="text-right">
                    {data.totalMovements > 0 
                      ? ((movement.count / data.totalMovements) * 100).toFixed(1)
                      : 0}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top produits déplacés */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 des produits les plus déplacés</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead className="text-right">Mouvements</TableHead>
                <TableHead className="text-right">Quantité totale</TableHead>
                <TableHead className="text-right">Moyenne par mouvement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topMovedProducts.slice(0, 10).map((product, index) => (
                <TableRow key={product.productId}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">#{index + 1}</Badge>
                      {product.productName}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{product.movementCount}</TableCell>
                  <TableCell className="text-right">{product.totalQuantity}</TableCell>
                  <TableCell className="text-right">
                    {product.movementCount > 0 
                      ? (product.totalQuantity / product.movementCount).toFixed(1)
                      : 0}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Évolution par période */}
      {data.movementsByPeriod.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Évolution des mouvements</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Période</TableHead>
                  <TableHead className="text-right">Mouvements</TableHead>
                  <TableHead className="text-right">Quantité</TableHead>
                  <TableHead className="text-right">Évolution</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.movementsByPeriod.map((period, index) => {
                  const previousPeriod = data.movementsByPeriod[index - 1];
                  const evolution = previousPeriod 
                    ? ((period.movements - previousPeriod.movements) / previousPeriod.movements) * 100
                    : 0;
                  
                  return (
                    <TableRow key={period.period}>
                      <TableCell className="font-medium">{period.period}</TableCell>
                      <TableCell className="text-right">{period.movements}</TableCell>
                      <TableCell className="text-right">{period.quantity}</TableCell>
                      <TableCell className="text-right">
                        {index > 0 && (
                          <Badge variant={evolution >= 0 ? "default" : "secondary"}>
                            {evolution >= 0 ? "+" : ""}{evolution.toFixed(1)}%
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}