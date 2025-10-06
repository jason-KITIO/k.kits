"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, TrendingDown, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { StockAlert } from "@/types/stock-alert";

const urgencyConfig = {
  CRITICAL: { color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/20 border-red-200", badge: "destructive" as const, icon: AlertTriangle },
  HIGH: { color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950/20 border-orange-200", badge: "default" as const, icon: TrendingDown },
  MEDIUM: { color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200", badge: "secondary" as const, icon: Package },
};

export function StockAlertCard({ alert }: { alert: StockAlert }) {
  const config = urgencyConfig[alert.urgency as keyof typeof urgencyConfig];
  const Icon = config.icon;
  const location = alert.store?.name || alert.warehouse?.name || "Localisation inconnue";

  return (
    <Card className={cn("transition-all hover:shadow-lg border-0", config.bg)}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-background shadow-sm border">
            <Icon className={cn("h-6 w-6", config.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold truncate">{alert.product.name}</h3>
              <Badge variant={config.badge}>{alert.urgency}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              SKU: {alert.product.sku} • {location}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Stock actuel</span>
                <span className={cn("font-medium", config.color)}>
                  {alert.quantity} / {alert.product.minStock} unités
                </span>
              </div>
              <Progress value={alert.percentageLeft || 0} className="h-2" />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {alert.percentageLeft?.toFixed(1) || '0'}% du seuil minimum
                </span>
                <span className="text-sm font-medium">
                  {alert.product.unitPrice?.toLocaleString() || '0'} FCFA/unité
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
