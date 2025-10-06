"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stock } from "@/types/stock";

interface StockStatsProps {
  stocks: Stock[];
}

export function StockStats({ stocks }: StockStatsProps) {
  const totalProducts = stocks.length;
  const lowStockCount = stocks.filter(s => s.quantity <= s.product.minStock).length;
  const totalValue = stocks.reduce((sum, stock) => 
    sum + (stock.quantity * stock.product.unitPrice), 0);
  const outOfStock = stocks.filter(s => s.quantity === 0).length;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Produits en stock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProducts}</div>
          <p className="text-xs text-muted-foreground">Références</p>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-red-600">Stock bas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{lowStockCount}</div>
          <p className="text-xs text-muted-foreground">Produits concernés</p>
        </CardContent>
      </Card>

      <Card className="border-orange-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-orange-600">Rupture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{outOfStock}</div>
          <p className="text-xs text-muted-foreground">Stock épuisé</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Valeur totale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalValue.toLocaleString()} FCFA</div>
          <p className="text-xs text-muted-foreground">Valeur du stock</p>
        </CardContent>
      </Card>
    </div>
  );
}