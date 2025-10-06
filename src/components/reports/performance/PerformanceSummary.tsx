"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, Target, BarChart3 } from "lucide-react";

interface PerformanceSummaryProps {
  salesGrowth: number;
  revenueGrowth: number;
  customerGrowth: number;
  inventoryTurnover: number;
  conversionRate: number;
}

export function PerformanceSummary({ salesGrowth, revenueGrowth, customerGrowth, inventoryTurnover, conversionRate }: PerformanceSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Résumé de Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <h4 className="font-medium text-green-600">Points Forts</h4>
            <div className="space-y-2">
              {salesGrowth > 0 && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Croissance des ventes positive</span>
                </div>
              )}
              {revenueGrowth > 0 && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Augmentation du chiffre d'affaires</span>
                </div>
              )}
              {customerGrowth > 0 && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Acquisition de nouveaux clients</span>
                </div>
              )}
              {inventoryTurnover >= 4 && (
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Rotation des stocks optimale</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-red-600">Points d'Amélioration</h4>
            <div className="space-y-2">
              {salesGrowth < 0 && (
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Baisse des ventes à analyser</span>
                </div>
              )}
              {conversionRate < 5 && (
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Taux de conversion à améliorer</span>
                </div>
              )}
              {inventoryTurnover < 4 && (
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Rotation des stocks lente</span>
                </div>
              )}
              {customerGrowth < 0 && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Perte de clients à investiguer</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
