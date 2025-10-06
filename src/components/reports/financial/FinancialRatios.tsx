"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart } from "lucide-react";

interface Ratios {
  currentRatio: number;
  quickRatio: number;
  debtToEquity: number;
  inventoryTurnover: number;
}

interface FinancialRatiosProps {
  ratios: Ratios;
}

export function FinancialRatios({ ratios }: FinancialRatiosProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-blue-500" />
          Ratios Financiers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Ratio de Liquidité Générale</span>
            <Badge variant={ratios.currentRatio >= 1 ? "default" : "destructive"}>
              {ratios.currentRatio.toFixed(2)}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Ratio de Liquidité Réduite</span>
            <Badge variant={ratios.quickRatio >= 1 ? "default" : "destructive"}>
              {ratios.quickRatio.toFixed(2)}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Ratio Dette/Capitaux Propres</span>
            <Badge variant={ratios.debtToEquity <= 1 ? "default" : "secondary"}>
              {ratios.debtToEquity.toFixed(2)}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Rotation des Stocks</span>
            <Badge variant="secondary">{ratios.inventoryTurnover.toFixed(1)}x</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
