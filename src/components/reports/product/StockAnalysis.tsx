"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StockAnalysisData {
  totalStockValue: number;
  averageStockLevel: number;
  stockTurnoverRate: number;
}

interface StockAnalysisProps {
  data: StockAnalysisData;
}

export function StockAnalysis({ data }: StockAnalysisProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse du Stock</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <p className="text-sm font-medium">Valeur Totale du Stock</p>
            <p className="text-2xl font-bold">{data.totalStockValue.toLocaleString()} €</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Niveau Moyen de Stock</p>
            <p className="text-2xl font-bold">{data.averageStockLevel.toFixed(0)} unités</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Taux de Rotation</p>
            <p className="text-2xl font-bold">{data.stockTurnoverRate.toFixed(1)}x</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
