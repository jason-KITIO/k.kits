"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface GrowthIndicatorsProps {
  salesGrowth: number;
  revenueGrowth: number;
  customerGrowth: number;
}

export function GrowthIndicators({ salesGrowth, revenueGrowth, customerGrowth }: GrowthIndicatorsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Indicateurs de Croissance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Ventes</span>
            <div className="flex items-center gap-2">
              <Badge variant={salesGrowth >= 0 ? "default" : "destructive"}>
                {salesGrowth >= 0 ? '+' : ''}{salesGrowth.toFixed(1)}%
              </Badge>
              {salesGrowth >= 0 ? 
                <TrendingUp className="h-4 w-4 text-green-500" /> : 
                <TrendingDown className="h-4 w-4 text-red-500" />
              }
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Chiffre d'Affaires</span>
            <div className="flex items-center gap-2">
              <Badge variant={revenueGrowth >= 0 ? "default" : "destructive"}>
                {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth.toFixed(1)}%
              </Badge>
              {revenueGrowth >= 0 ? 
                <TrendingUp className="h-4 w-4 text-green-500" /> : 
                <TrendingDown className="h-4 w-4 text-red-500" />
              }
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Base Clients</span>
            <div className="flex items-center gap-2">
              <Badge variant={customerGrowth >= 0 ? "default" : "destructive"}>
                {customerGrowth >= 0 ? '+' : ''}{customerGrowth.toFixed(1)}%
              </Badge>
              {customerGrowth >= 0 ? 
                <TrendingUp className="h-4 w-4 text-green-500" /> : 
                <TrendingDown className="h-4 w-4 text-red-500" />
              }
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
