"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMyRequests, useCancelTransfer } from "@/hooks/use-transfers";
import { toast } from "sonner";
import {
  User,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRightLeft,
} from "lucide-react";

interface MyRequestsProps {
  organizationId: string;
}

export function MyRequests({ organizationId }: MyRequestsProps) {
  const { data: requests = [], isLoading } = useMyRequests(organizationId);
  const cancelMutation = useCancelTransfer(organizationId);

  const handleCancel = async (transferId: string) => {
    if (confirm("Annuler cette demande ?")) {
      try {
        await cancelMutation.mutateAsync(transferId);
        toast.success("Demande annulée");
      } catch {
        toast.error("Erreur lors de l'annulation");
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: {
        variant: "secondary" as const,
        icon: Clock,
        text: "En attente",
      },
      APPROVED: {
        variant: "default" as const,
        icon: CheckCircle,
        text: "Approuvé",
      },
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
      variants[status as keyof typeof variants] || variants.PENDING;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
        <span>{config.text}</span>
      </Badge>
    );
  };

  if (isLoading) return <div>Chargement de vos demandes...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Mes demandes de transfert</h2>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucune demande trouvée</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ArrowRightLeft className="h-5 w-5" />
                    <span>{request.product?.name}</span>
                  </div>
                  {getStatusBadge(request.status)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">SKU:</span>{" "}
                    {request.product?.sku}
                  </div>
                  <div>
                    <span className="font-medium">Quantité:</span>{" "}
                    {request.quantity}
                  </div>
                  <div>
                    <span className="font-medium">Source:</span>{" "}
                    {request.sourceWarehouse?.name || "Employé"}
                  </div>
                  <div>
                    <span className="font-medium">Destination:</span>{" "}
                    {request.destWarehouse?.name || "Employé"}
                  </div>
                  <div>
                    <span className="font-medium">Demandé le:</span>{" "}
                    {new Date(request.requestedAt).toLocaleDateString()}
                  </div>
                  {request.approvedAt && (
                    <div>
                      <span className="font-medium">Approuvé le:</span>{" "}
                      {new Date(request.approvedAt).toLocaleDateString()}
                    </div>
                  )}
                  {request.completedAt && (
                    <div>
                      <span className="font-medium">Terminé le:</span>{" "}
                      {new Date(request.completedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {request.notes && (
                  <div className="text-sm">
                    <span className="font-medium">Notes:</span> {request.notes}
                  </div>
                )}

                {request.status === "PENDING" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancel(request.id)}
                    disabled={cancelMutation.isPending}
                  >
                    Annuler la demande
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
