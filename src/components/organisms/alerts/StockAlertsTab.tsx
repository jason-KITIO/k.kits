"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Package } from "lucide-react";
import { StockAlertCard } from "@/components/molecules/alerts/StockAlertCard";
import { AlertsStats } from "@/components/molecules/alerts/AlertsStats";
import { StockAlert } from "@/types/stock-alert";

interface StockAlertsTabProps {
  alerts?: StockAlert[];
  isLoading: boolean;
}

export function StockAlertsTab({ alerts, isLoading }: StockAlertsTabProps) {
  const criticalCount = alerts?.filter(a => a.urgency === "CRITICAL").length || 0;
  const highCount = alerts?.filter(a => a.urgency === "HIGH").length || 0;
  const totalValue = alerts?.reduce((sum, alert) => 
    sum + (alert.product.unitPrice || 0) * alert.quantity, 0
  ) || 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AlertsStats 
        total={alerts?.length || 0}
        unread={0}
        urgent={0}
        type="stock"
        critical={criticalCount}
        high={highCount}
        value={totalValue}
      />

      <div className="space-y-4">
        {alerts && alerts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {alerts.map(alert => (
              <StockAlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium mb-2 text-green-600">Aucune alerte !</h3>
              <p className="text-muted-foreground text-center">
                Excellent ! Tous vos produits ont un stock suffisant.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
