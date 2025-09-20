"use client";

import { useState } from "react";
import { useStockMovementRequests, useApproveStockMovementRequest } from "@/hooks/use-stock-movement-requests";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Plus, Package, ArrowRight } from "lucide-react";
import { CreateStockMovementRequestDialog } from "./create-stock-movement-request-dialog";
import { ApprovalDialog } from "./approval-dialog";
import type { StockMovementRequestWithRelations } from "@/types/stock-movement-request";

interface StockMovementRequestListProps {
  organizationId: string;
  storeId: string;
  status?: string;
}

export function StockMovementRequestList({ organizationId, storeId, status }: StockMovementRequestListProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [approvalRequest, setApprovalRequest] = useState<StockMovementRequestWithRelations | null>(null);

  const { data: requests, isLoading } = useStockMovementRequests(organizationId, storeId, { status });
  const approveRequest = useApproveStockMovementRequest(organizationId, storeId);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      PENDING: { variant: "default" as const, label: "En attente" },
      APPROVED: { variant: "default" as const, label: "Approuvée" },
      REJECTED: { variant: "destructive" as const, label: "Refusée" },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { variant: "default" as const, label: status };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  if (isLoading) return <div>Chargement des demandes...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mes Demandes de Déplacement</h2>
        <Button onClick={() => setCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          📦 Demander un déplacement
        </Button>
      </div>

      <div className="grid gap-4">
        {requests?.map((request) => (
          <Card key={request.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Package className="h-5 w-5" />
                {request.product.name}
              </CardTitle>
              <div className="flex gap-2 items-center">
                {getStatusBadge(request.status)}
                {request.status === "PENDING" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setApprovalRequest(request)}
                  >
                    Traiter
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">{request.quantity}</span>
                  <span className="text-sm text-muted-foreground">articles demandés</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium">De: {request.fromType} ({request.fromId})</span>
                  <ArrowRight className="h-4 w-4" />
                  <span className="font-medium">Vers: {request.toType} ({request.toId})</span>
                </div>
                
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm font-medium mb-1">Motif de la demande :</p>
                  <p className="text-sm">{request.reason}</p>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Demandé par : <span className="font-medium">{request.requester.firstName} {request.requester.lastName}</span></span>
                  <span className="text-muted-foreground">{new Date(request.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
                
                {request.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                    <p className="text-sm font-medium text-red-800 mb-1">Motif du refus :</p>
                    <p className="text-sm text-red-700">{request.rejectionReason}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {requests?.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucune demande créée</h3>
            <p className="text-muted-foreground text-center mb-4">
              Vous n'avez pas encore demandé de déplacement d'articles
            </p>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ma première demande
            </Button>
          </CardContent>
        </Card>
      )}

      <CreateStockMovementRequestDialog
        organizationId={organizationId}
        storeId={storeId}
        open={createOpen}
        onOpenChange={setCreateOpen}
      />

      {approvalRequest && (
        <ApprovalDialog
          organizationId={organizationId}
          storeId={storeId}
          request={approvalRequest}
          open={!!approvalRequest}
          onOpenChange={(open) => !open && setApprovalRequest(null)}
        />
      )}
    </div>
  );
}