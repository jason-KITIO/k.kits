"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTransfers } from "@/hooks/use-transfers";
import {
  History,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRightLeft,
} from "lucide-react";

interface TransferHistoryProps {
  organizationId: string;
}

export function TransferHistory({ organizationId }: TransferHistoryProps) {
  const { data: transfers = [], isLoading } = useTransfers(organizationId);

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

  if (isLoading) return <div>Chargement de l&apos;historique...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Historique des transferts</h2>

      {transfers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucun transfert trouvé</p>
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
              <CardContent className="space-y-2">
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
                    <span className="font-medium">Date de demande:</span>{" "}
                    {new Date(transfer.requestedAt).toLocaleDateString()}
                  </div>
                </div>

                {transfer.approvedAt && (
                  <div className="text-sm">
                    <span className="font-medium">Approuvé le:</span>{" "}
                    {new Date(transfer.approvedAt).toLocaleDateString()}
                  </div>
                )}

                {transfer.completedAt && (
                  <div className="text-sm">
                    <span className="font-medium">Terminé le:</span>{" "}
                    {new Date(transfer.completedAt).toLocaleDateString()}
                  </div>
                )}

                {transfer.notes && (
                  <div className="text-sm">
                    <span className="font-medium">Notes:</span> {transfer.notes}
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
