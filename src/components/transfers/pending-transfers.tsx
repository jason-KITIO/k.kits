"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  usePendingTransfers,
  useApproveTransfer,
  useCompleteTransfer,
  useCancelTransfer,
} from "@/hooks/use-transfers";
import { toast } from "sonner";
import { Clock, CheckCircle, XCircle, ArrowRightLeft } from "lucide-react";

interface PendingTransfersProps {
  organizationId: string;
}

export function PendingTransfers({ organizationId }: PendingTransfersProps) {
  const { data: transfers = [], isLoading } =
    usePendingTransfers(organizationId);
  const approveMutation = useApproveTransfer(organizationId);
  const completeMutation = useCompleteTransfer(organizationId);
  const cancelMutation = useCancelTransfer(organizationId);

  const handleApprove = async (transferId: string) => {
    try {
      await approveMutation.mutateAsync(transferId);
      toast.success("Transfert approuvé");
    } catch {
      toast.error("Erreur lors de l'approbation");
    }
  };

  const handleComplete = async (transferId: string) => {
    try {
      await completeMutation.mutateAsync(transferId);
      toast.success("Transfert finalisé");
    } catch {
      toast.error("Erreur lors de la finalisation");
    }
  };

  const handleCancel = async (transferId: string) => {
    if (confirm("Annuler ce transfert ?")) {
      try {
        await cancelMutation.mutateAsync(transferId);
        toast.success("Transfert annulé");
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

  if (isLoading) return <div>Chargement des transferts en attente...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Transferts en attente</h2>

      {transfers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucun transfert en attente</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {transfers.map((transfer) => (
            <Card key={transfer.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ArrowRightLeft className="h-5 w-5" />
                    <span>{transfer.product?.name}</span>
                  </div>
                  {getStatusBadge(transfer.status)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">SKU:</span>{" "}
                    {transfer.product?.sku}
                  </div>
                  <div>
                    <span className="font-medium">Quantité:</span>{" "}
                    {transfer.quantity}
                  </div>
                  <div>
                    <span className="font-medium">Source:</span>{" "}
                    {transfer.sourceWarehouse?.name || "Employé"}
                  </div>
                  <div>
                    <span className="font-medium">Destination:</span>{" "}
                    {transfer.destWarehouse?.name || "Employé"}
                  </div>
                  <div>
                    <span className="font-medium">Demandé par:</span>{" "}
                    {transfer.requester?.firstName}{" "}
                    {transfer.requester?.lastName}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(transfer.requestedAt).toLocaleDateString()}
                  </div>
                </div>

                {transfer.notes && (
                  <div className="text-sm">
                    <span className="font-medium">Notes:</span> {transfer.notes}
                  </div>
                )}

                <div className="flex space-x-2">
                  {transfer.status === "PENDING" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(transfer.id)}
                        disabled={approveMutation.isPending}
                      >
                        Approuver
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancel(transfer.id)}
                        disabled={cancelMutation.isPending}
                      >
                        Annuler
                      </Button>
                    </>
                  )}

                  {transfer.status === "APPROVED" && (
                    <Button
                      size="sm"
                      onClick={() => handleComplete(transfer.id)}
                      disabled={completeMutation.isPending}
                    >
                      Finaliser
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
