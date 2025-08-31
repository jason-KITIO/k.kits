"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useInventories } from "@/hooks/use-inventories";
import {
  History,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface InventoryHistoryProps {
  organizationId: string;
}

export function InventoryHistory({ organizationId }: InventoryHistoryProps) {
  const { data: inventories = [], isLoading } = useInventories(organizationId);

  const completedInventories = inventories.filter(
    (inv) => inv.status === "COMPLETED"
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      COMPLETED: {
        variant: "default" as const,
        icon: CheckCircle,
        text: "Terminé",
      },
      CANCELLED: {
        variant: "destructive" as const,
        icon: XCircle,
        text: "Annulé",
      },
    };

    const config =
      variants[status as keyof typeof variants] || variants.COMPLETED;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
        <span>{config.text}</span>
      </Badge>
    );
  };

  const getDifferenceBadge = (difference: number) => {
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

  if (isLoading) return <div>Chargement de l&apos;historique...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Historique des inventaires</h2>

      {completedInventories.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucun inventaire terminé</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {completedInventories.map((inventory) => (
            <Card key={inventory.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{inventory.product?.name}</span>
                  {getStatusBadge(inventory.status)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">SKU:</span>{" "}
                    {inventory.product?.sku}
                  </div>
                  <div>
                    <span className="font-medium">Attendu:</span>{" "}
                    {inventory.expectedQty}
                  </div>
                  <div>
                    <span className="font-medium">Réel:</span>{" "}
                    {inventory.actualQty}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Écart:</span>
                    {getDifferenceBadge(inventory.difference)}
                  </div>
                  <div>
                    <span className="font-medium">Planifié:</span>{" "}
                    {new Date(inventory.scheduledDate).toLocaleDateString()}
                  </div>
                  {inventory.completedAt && (
                    <div>
                      <span className="font-medium">Terminé:</span>{" "}
                      {new Date(inventory.completedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
                {inventory.warehouse && (
                  <div className="text-sm">
                    <span className="font-medium">Entrepôt:</span>{" "}
                    {inventory.warehouse.name}
                  </div>
                )}
                {inventory.notes && (
                  <div className="text-sm">
                    <span className="font-medium">Notes:</span>{" "}
                    {inventory.notes}
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
