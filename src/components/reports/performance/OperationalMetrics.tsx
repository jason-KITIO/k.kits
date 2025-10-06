"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface OperationalMetricsProps {
  averageOrderValue: number;
  conversionRate: number;
  inventoryTurnover: number;
}

export function OperationalMetrics({ averageOrderValue, conversionRate, inventoryTurnover }: OperationalMetricsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Métriques Opérationnelles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Panier Moyen</span>
            <p className="font-medium">{averageOrderValue.toFixed(2)} €</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Taux de Conversion</span>
            <div className="text-right">
              <p className="font-medium">{conversionRate.toFixed(1)}%</p>
              <Progress value={conversionRate} className="w-20 h-2 mt-1" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Rotation des Stocks</span>
            <div className="text-right">
              <p className="font-medium">{inventoryTurnover.toFixed(1)}x</p>
              <Badge variant={inventoryTurnover >= 4 ? "default" : "secondary"}>
                {inventoryTurnover >= 4 ? "Optimal" : "À améliorer"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
