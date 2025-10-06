"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { useOptimizedQuery } from "@/hooks/use-optimized-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

const statusLabels = {
  PENDING: "En attente",
  APPROVED: "Approuvée",
  REJECTED: "Rejetée",
};

export function StockRequestsTab({ organizationId }: { organizationId: string }) {
  const queryClient = useQueryClient();

  const { data: stockRequests, isLoading } = useOptimizedQuery({
    queryKey: ["stock-movement-requests", organizationId],
    queryFn: async () => {
      const response = await fetch(`/api/organization/${organizationId}/stock-movement-requests`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Erreur lors de la récupération des requêtes");
      return response.json();
    },
    enabled: !!organizationId,
  });

  const approveMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const response = await fetch(
        `/api/organization/${organizationId}/stock-movement-requests/${requestId}/approve`,
        { method: "POST", credentials: "include" }
      );
      if (!response.ok) throw new Error("Erreur lors de l'approbation");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-movement-requests", organizationId] });
      toast.success("Requête approuvée avec succès");
    },
    onError: () => toast.error("Erreur lors de l'approbation"),
  });

  if (isLoading) {
    return <Card><CardContent className="p-12 text-center">Chargement...</CardContent></Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Requêtes de mouvement de stock</CardTitle>
      </CardHeader>
      <CardContent>
        {stockRequests && stockRequests.length > 0 ? (
          <div className="space-y-4">
            {stockRequests.map((request: any) => (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{request.product.name}</div>
                  <div className="text-sm text-muted-foreground">
                    SKU: {request.product.sku} • Quantité: {request.quantity}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {request.fromWarehouse?.name || 'Entrepôt'} → {request.toStore?.name || 'Boutique'}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm">{request.requester.firstName} {request.requester.lastName}</div>
                  <Badge className={statusColors[request.status as keyof typeof statusColors]}>
                    {statusLabels[request.status as keyof typeof statusLabels]}
                  </Badge>
                  {request.status === "PENDING" && (
                    <Button size="sm" onClick={() => approveMutation.mutate(request.id)} disabled={approveMutation.isPending}>
                      Approuver
                    </Button>
                  )}
                  <div className="text-sm text-muted-foreground">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucune requête</h3>
            <p className="text-muted-foreground">Aucune requête de mouvement de stock pour le moment.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
