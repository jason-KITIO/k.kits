"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, Zap } from "lucide-react";

interface KPI {
  name: string;
  value: number;
  change: number;
  trend: "up" | "down" | "stable";
}

interface KPIGridProps {
  kpis: KPI[];
}

const getTrendIcon = (trend: "up" | "down" | "stable") => {
  switch (trend) {
    case "up": return TrendingUp;
    case "down": return TrendingDown;
    default: return BarChart3;
  }
};

const getTrendColor = (trend: "up" | "down" | "stable") => {
  switch (trend) {
    case "up": return "text-green-500";
    case "down": return "text-red-500";
    default: return "text-gray-500";
  }
};

export function KPIGrid({ kpis }: KPIGridProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Indicateurs Clés de Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {kpis.map((kpi, index) => {
            const TrendIcon = getTrendIcon(kpi.trend);
            const trendColor = getTrendColor(kpi.trend);
            
            return (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{kpi.name}</h4>
                  <TrendIcon className={`h-4 w-4 ${trendColor}`} />
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">{kpi.value.toLocaleString()}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={kpi.change >= 0 ? "default" : "destructive"} className="text-xs">
                      {kpi.change >= 0 ? '+' : ''}{kpi.change.toFixed(1)}%
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {kpi.trend === "up" ? "En hausse" : kpi.trend === "down" ? "En baisse" : "Stable"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
