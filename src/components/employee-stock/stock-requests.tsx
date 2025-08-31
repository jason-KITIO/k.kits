"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  useStockRequests,
  useCreateStockRequest,
  useCancelStockRequest,
} from "@/hooks/use-employee-stock";
import { useProducts } from "@/hooks/use-products";
import { toast } from "sonner";
import { Plus, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface StockRequestsProps {
  organizationId: string;
}

export function StockRequests({ organizationId }: StockRequestsProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [requestData, setRequestData] = useState({
    productId: "",
    requestType: "IN" as "IN" | "OUT" | "TRANSFER",
    quantity: 1,
    reason: "",
    notes: "",
  });

  const { data: requests = [], isLoading } = useStockRequests(organizationId);
  const { data: products = [] } = useProducts(organizationId);
  const createMutation = useCreateStockRequest(organizationId);
  const cancelMutation = useCancelStockRequest(organizationId);

  const handleCreate = () => {
    setRequestData({
      productId: "",
      requestType: "IN",
      quantity: 1,
      reason: "",
      notes: "",
    });
    setIsCreateModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync(requestData);
      toast.success("Demande créée avec succès");
      setIsCreateModalOpen(false);
    } catch {
      toast.error("Erreur lors de la création de la demande");
    }
  };

  const handleCancel = async (requestId: string) => {
    if (confirm("Annuler cette demande ?")) {
      try {
        await cancelMutation.mutateAsync(requestId);
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
        text: "Approuvée",
      },
      REJECTED: {
        variant: "destructive" as const,
        icon: XCircle,
        text: "Rejetée",
      },
      COMPLETED: {
        variant: "default" as const,
        icon: CheckCircle,
        text: "Terminée",
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

  const getRequestTypeText = (type: string) => {
    const types = {
      IN: "Entrée",
      OUT: "Sortie",
      TRANSFER: "Transfert",
    };
    return types[type as keyof typeof types] || type;
  };

  if (isLoading) return <div>Chargement des demandes...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mes demandes</h2>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle demande
        </Button>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Aucune demande trouvée</p>
            <Button onClick={handleCreate}>Créer votre première demande</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{request.product?.name}</span>
                  {getStatusBadge(request.status)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Type:</span>{" "}
                    {getRequestTypeText(request.requestType)}
                  </div>
                  <div>
                    <span className="font-medium">Quantité:</span>{" "}
                    {request.quantity}
                  </div>
                  <div>
                    <span className="font-medium">SKU:</span>{" "}
                    {request.product?.sku}
                  </div>
                  <div>
                    <span className="font-medium">Demandé le:</span>{" "}
                    {new Date(request.requestedAt).toLocaleDateString()}
                  </div>
                </div>
                {request.reason && (
                  <div className="text-sm">
                    <span className="font-medium">Raison:</span>{" "}
                    {request.reason}
                  </div>
                )}
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
                    Annuler
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle demande de stock</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="productId">Produit *</Label>
              <Select
                value={requestData.productId}
                onValueChange={(value) =>
                  setRequestData({ ...requestData, productId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un produit" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({product.sku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="requestType">Type de demande *</Label>
              <Select
                value={requestData.requestType}
                onValueChange={(value: "IN" | "OUT" | "TRANSFER") =>
                  setRequestData({ ...requestData, requestType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN">Entrée de stock</SelectItem>
                  <SelectItem value="OUT">Sortie de stock</SelectItem>
                  <SelectItem value="TRANSFER">Transfert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quantity">Quantité *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={requestData.quantity}
                onChange={(e) =>
                  setRequestData({
                    ...requestData,
                    quantity: Number(e.target.value),
                  })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="reason">Raison</Label>
              <Input
                id="reason"
                value={requestData.reason}
                onChange={(e) =>
                  setRequestData({ ...requestData, reason: e.target.value })
                }
                placeholder="Raison de la demande..."
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={requestData.notes}
                onChange={(e) =>
                  setRequestData({ ...requestData, notes: e.target.value })
                }
                placeholder="Commentaires additionnels..."
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Création..." : "Créer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
