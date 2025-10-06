"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface Metrics {
  roi: number;
  roa: number;
  grossProfitMargin: number;
  netProfitMargin: number;
}

interface ProfitabilityMetricsProps {
  metrics: Metrics;
}

export function ProfitabilityMetrics({ metrics }: ProfitabilityMetricsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          Métriques de Rentabilité
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">ROI (Retour sur Investissement)</span>
            <Badge variant={metrics.roi >= 0 ? "default" : "destructive"}>
              {metrics.roi.toFixed(1)}%
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">ROA (Retour sur Actifs)</span>
            <Badge variant={metrics.roa >= 0 ? "default" : "destructive"}>
              {metrics.roa.toFixed(1)}%
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Marge Bénéficiaire Brute</span>
            <Badge variant="secondary">{metrics.grossProfitMargin.toFixed(1)}%</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Marge Bénéficiaire Nette</span>
            <Badge variant={metrics.netProfitMargin >= 0 ? "default" : "destructive"}>
              {metrics.netProfitMargin.toFixed(1)}%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
