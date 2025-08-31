"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useStockAlerts,
  useAcknowledgeAlert,
  useResolveAlert,
} from "@/hooks/use-alerts";
import { toast } from "sonner";
import { CheckCircle, TrendingUp, Eye } from "lucide-react";

interface OverstockAlertsProps {
  organizationId: string;
}

export function OverstockAlerts({ organizationId }: OverstockAlertsProps) {
  const { data: allAlerts = [], isLoading } = useStockAlerts(organizationId);
  const acknowledgeMutation = useAcknowledgeAlert(organizationId);
  const resolveMutation = useResolveAlert(organizationId);

  const overstockAlerts = allAlerts.filter(
    (alert) => alert.alertType === "OVERSTOCK"
  );

  const handleAcknowledge = async (alertId: string) => {
    try {
      await acknowledgeMutation.mutateAsync(alertId);
      toast.success("Alerte accusée réception");
    } catch {
      toast.error("Erreur lors de l'accusé de réception");
    }
  };

  const handleResolve = async (alertId: string) => {
    try {
      await resolveMutation.mutateAsync(alertId);
      toast.success("Alerte résolue");
    } catch {
      toast.error("Erreur lors de la résolution");
    }
  };

  if (isLoading) return <div>Chargement des alertes surstock...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Alertes surstock</h2>

      {overstockAlerts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-4" />
            <p className="text-muted-foreground">Aucune alerte de surstock</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {overstockAlerts.map((alert) => (
            <Card key={alert.id} className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span>{alert.product?.name}</span>
                  </div>
                  <Badge variant="default">Surstock</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">SKU:</span>{" "}
                    {alert.product?.sku}
                  </div>
                  <div>
                    <span className="font-medium">Stock actuel:</span>
                    <span className="text-blue-600 font-bold ml-1">
                      {alert.currentQty}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Seuil maximum:</span>{" "}
                    {alert.thresholdQty}
                  </div>
                  <div>
                    <span className="font-medium">Excédent:</span>
                    <span className="text-blue-600 font-bold ml-1">
                      +{alert.currentQty - alert.thresholdQty}
                    </span>
                  </div>
                </div>

                {alert.warehouse && (
                  <div className="text-sm">
                    <span className="font-medium">Entrepôt:</span>{" "}
                    {alert.warehouse.name}
                  </div>
                )}

                <div className="text-sm">
                  <span className="font-medium">Message:</span> {alert.message}
                </div>

                <div className="text-sm text-muted-foreground">
                  Créée le {new Date(alert.createdAt).toLocaleDateString()}
                </div>

                {alert.status === "ACTIVE" && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAcknowledge(alert.id)}
                      disabled={acknowledgeMutation.isPending}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Accuser réception
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleResolve(alert.id)}
                      disabled={resolveMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Résoudre
                    </Button>
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
