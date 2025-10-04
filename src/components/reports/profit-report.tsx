"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, TrendingDown, Target } from "lucide-react";
import type { ProfitReport } from "@/schema/report.schema";

interface ProfitReportProps {
  data: ProfitReport;
  isLoading?: boolean;
}

export function ProfitReportComponent({ data, isLoading }: ProfitReportProps) {
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

  const getMarginColor = (margin: number) => {
    if (margin >= 30) return "text-green-600";
    if (margin >= 15) return "text-yellow-600";
    return "text-red-600";
  };

  const getMarginBadge = (margin: number) => {
    if (margin >= 30) return { variant: "default" as const, label: "Excellente" };
    if (margin >= 15) return { variant: "secondary" as const, label: "Correcte" };
    return { variant: "destructive" as const, label: "Faible" };
  };

  return (
    <div className="space-y-6">
      {/* KPIs principaux */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XAF'
              }).format(data.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Revenue total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coûts totaux</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XAF'
              }).format(data.totalCost)}
            </div>
            <p className="text-xs text-muted-foreground">
              Coût de revient
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bénéfice brut</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XAF'
              }).format(data.grossProfit)}
            </div>
            <p className="text-xs text-muted-foreground">
              Profit net
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marge globale</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getMarginColor(data.profitMargin)}`}>
              {data.profitMargin.toFixed(1)}%
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Progress value={Math.min(data.profitMargin, 100)} className="flex-1 h-2" />
              <Badge {...getMarginBadge(data.profitMargin)}>
                {getMarginBadge(data.profitMargin).label}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rentabilité par produit */}
      <Card>
        <CardHeader>
          <CardTitle>Rentabilité par produit</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead className="text-right">CA</TableHead>
                <TableHead className="text-right">Coût</TableHead>
                <TableHead className="text-right">Profit</TableHead>
                <TableHead className="text-right">Marge</TableHead>
                <TableHead className="text-right">Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.profitByProduct.slice(0, 15).map((product, index) => {
                const marginBadge = getMarginBadge(product.margin);
                return (
                  <TableRow key={product.productId}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">#{index + 1}</Badge>
                        {product.productName}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'XAF'
                      }).format(product.revenue)}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'XAF'
                      }).format(product.cost)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={product.profit >= 0 ? "text-green-600" : "text-red-600"}>
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'XAF'
                        }).format(product.profit)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={getMarginColor(product.margin)}>
                        {product.margin.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2">
                        <Progress value={Math.min(Math.max(product.margin, 0), 100)} className="w-16 h-2" />
                        <Badge variant={marginBadge.variant} className="text-xs">
                          {marginBadge.label}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Évolution de la rentabilité */}
      {data.profitByPeriod.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Évolution de la rentabilité</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Période</TableHead>
                  <TableHead className="text-right">CA</TableHead>
                  <TableHead className="text-right">Coût</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                  <TableHead className="text-right">Marge</TableHead>
                  <TableHead className="text-right">Évolution</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.profitByPeriod.map((period, index) => {
                  const margin = period.revenue > 0 ? (period.profit / period.revenue) * 100 : 0;
                  const previousPeriod = data.profitByPeriod[index - 1];
                  const previousMargin = previousPeriod && previousPeriod.revenue > 0 
                    ? (previousPeriod.profit / previousPeriod.revenue) * 100 
                    : 0;
                  const marginEvolution = index > 0 ? margin - previousMargin : 0;
                  
                  return (
                    <TableRow key={period.period}>
                      <TableCell className="font-medium">{period.period}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'XAF'
                        }).format(period.revenue)}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'XAF'
                        }).format(period.cost)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={period.profit >= 0 ? "text-green-600" : "text-red-600"}>
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'XAF'
                          }).format(period.profit)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={getMarginColor(margin)}>
                          {margin.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {index > 0 && (
                          <Badge variant={marginEvolution >= 0 ? "default" : "destructive"}>
                            {marginEvolution >= 0 ? "+" : ""}{marginEvolution.toFixed(1)}%
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

      {/* Analyse de performance */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top 5 - Produits les plus rentables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.profitByProduct
                .filter(p => p.profit > 0)
                .slice(0, 5)
                .map((product, index) => (
                  <div key={product.productId} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <span className="font-medium">{product.productName}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-bold">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'XAF'
                        }).format(product.profit)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {product.margin.toFixed(1)}% marge
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produits à optimiser</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.profitByProduct
                .filter(p => p.margin < 15)
                .slice(0, 5)
                .map((product, index) => (
                  <div key={product.productId} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">⚠</Badge>
                      <span className="font-medium">{product.productName}</span>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${product.profit >= 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'XAF'
                        }).format(product.profit)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {product.margin.toFixed(1)}% marge
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}