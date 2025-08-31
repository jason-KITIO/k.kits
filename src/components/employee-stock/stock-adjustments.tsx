"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStockAdjustments } from "@/hooks/use-employee-stock";
import { History, TrendingUp, TrendingDown } from "lucide-react";

interface StockAdjustmentsProps {
  organizationId: string;
}

export function StockAdjustments({ organizationId }: StockAdjustmentsProps) {
  const { data: adjustments = [], isLoading } =
    useStockAdjustments(organizationId);

  const getAdjustmentBadge = (difference: number) => {
    if (difference > 0) {
      return (
        <Badge variant="default" className="flex items-center space-x-1">
          <TrendingUp className="h-3 w-3" />
          <span>+{difference}</span>
        </Badge>
      );
    } else if (difference < 0) {
      return (
        <Badge variant="destructive" className="flex items-center space-x-1">
          <TrendingDown className="h-3 w-3" />
          <span>{difference}</span>
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <span>0</span>
      </Badge>
    );
  };

  if (isLoading) return <div>Chargement des ajustements...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Historique des ajustements</h2>

      {adjustments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucun ajustement trouvé</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {adjustments.map((adjustment) => (
            <Card key={adjustment.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{adjustment.product?.name}</span>
                  {getAdjustmentBadge(adjustment.difference)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">SKU:</span>{" "}
                    {adjustment.product?.sku}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(adjustment.adjustedAt).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Ancienne quantité:</span>{" "}
                    {adjustment.oldQuantity}
                  </div>
                  <div>
                    <span className="font-medium">Nouvelle quantité:</span>{" "}
                    {adjustment.newQuantity}
                  </div>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Raison:</span>{" "}
                  {adjustment.reason}
                </div>
                {adjustment.notes && (
                  <div className="text-sm">
                    <span className="font-medium">Notes:</span>{" "}
                    {adjustment.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
