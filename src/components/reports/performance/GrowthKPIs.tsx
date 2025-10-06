"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, TrendingUp, Users, Target } from "lucide-react";

interface GrowthKPIsProps {
  salesGrowth: number;
  revenueGrowth: number;
  customerGrowth: number;
  inventoryTurnover: number;
}

export function GrowthKPIs({ salesGrowth, revenueGrowth, customerGrowth, inventoryTurnover }: GrowthKPIsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Croissance des Ventes</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {salesGrowth >= 0 ? '+' : ''}{salesGrowth.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">vs période précédente</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Croissance du CA</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">Évolution du chiffre d'affaires</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Croissance Clients</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${customerGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {customerGrowth >= 0 ? '+' : ''}{customerGrowth.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">Nouveaux clients acquis</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rotation Inventaire</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inventoryTurnover.toFixed(1)}x</div>
          <p className="text-xs text-muted-foreground">Fois par période</p>
        </CardContent>
      </Card>
    </div>
  );
}
