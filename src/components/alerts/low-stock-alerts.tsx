"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useLowStockAlerts,
  useAcknowledgeAlert,
  useResolveAlert,
} from "@/hooks/use-alerts";
import { toast } from "sonner";
import { CheckCircle, AlertTriangle, Eye } from "lucide-react";

interface LowStockAlertsProps {
  organizationId: string;
}

export function LowStockAlerts({ organizationId }: LowStockAlertsProps) {
  const { data: alerts = [], isLoading } = useLowStockAlerts(organizationId);
  const acknowledgeMutation = useAcknowledgeAlert(organizationId);
  const resolveMutation = useResolveAlert(organizationId);

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

  const getSeverityBadge = (severity: string) => {
    const variants = {
      LOW: { variant: "secondary" as const, text: "Faible" },
      MEDIUM: { variant: "default" as const, text: "Moyen" },
      HIGH: { variant: "destructive" as const, text: "Élevé" },
      CRITICAL: { variant: "destructive" as const, text: "Critique" },
    };

    const config = variants[severity as keyof typeof variants] || variants.LOW;

    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  if (isLoading) return <div>Chargement des alertes...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Alertes stock bas</h2>

      {alerts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-4" />
            <p className="text-muted-foreground">Aucune alerte de stock bas</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card key={alert.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <span>{alert.product?.name}</span>
                  </div>
                  {getSeverityBadge(alert.severity)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">SKU:</span>{" "}
                    {alert.product?.sku}
                  </div>
                  <div>
                    <span className="font-medium">Stock actuel:</span>{" "}
                    {alert.currentQty}
                  </div>
                  <div>
                    <span className="font-medium">Seuil minimum:</span>{" "}
                    {alert.thresholdQty}
                  </div>
                  <div>
                    <span className="font-medium">Manque:</span>{" "}
                    {alert.thresholdQty - alert.currentQty}
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
