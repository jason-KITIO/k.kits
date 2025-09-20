"use client";

import { useState } from "react";
import { useStockReturns, useDeleteStockReturn } from "@/hooks/use-stock-returns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus } from "lucide-react";
import { CreateStockReturnDialog } from "./create-stock-return-dialog";
import { ProcessReturnDialog } from "./process-return-dialog";
import type { StockReturnWithRelations } from "@/types/stock-return";

interface StockReturnListProps {
  organizationId: string;
  storeId: string;
  status?: string;
}

export function StockReturnList({ organizationId, storeId, status }: StockReturnListProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [processReturn, setProcessReturn] = useState<StockReturnWithRelations | null>(null);

  const { data: returns, isLoading } = useStockReturns(organizationId, storeId, { status });
  const deleteReturn = useDeleteStockReturn(organizationId, storeId);

  const handleDelete = (returnId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce retour ?")) {
      deleteReturn.mutate(returnId);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      RECEIVED: "default",
      INSPECTED: "secondary",
      RESTOCKED: "default",
      DAMAGED: "destructive",
      RETURNED_TO_WAREHOUSE: "secondary",
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || "default"}>{status}</Badge>;
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Retours de Produits</h2>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Retour
        </Button>
      </div>

      <div className="grid gap-4">
        {returns?.map((returnItem) => (
          <Card key={returnItem.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {returnItem.product.name} - {returnItem.quantity} unités
              </CardTitle>
              <div className="flex gap-2 items-center">
                {getStatusBadge(returnItem.status)}
                {returnItem.status === "RECEIVED" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setProcessReturn(returnItem)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(returnItem.id)}
                  disabled={deleteReturn.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Retourné par: {returnItem.employee.firstName} {returnItem.employee.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  Condition: {returnItem.condition}
                </p>
                <p className="text-sm">{returnItem.returnReason}</p>
                {returnItem.notes && (
                  <p className="text-sm text-muted-foreground">
                    Notes: {returnItem.notes}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateStockReturnDialog
        organizationId={organizationId}
        storeId={storeId}
        open={createOpen}
        onOpenChange={setCreateOpen}
      />

      {processReturn && (
        <ProcessReturnDialog
          organizationId={organizationId}
          storeId={storeId}
          returnItem={processReturn}
          open={!!processReturn}
          onOpenChange={(open) => !open && setProcessReturn(null)}
        />
      )}
    </div>
  );
}