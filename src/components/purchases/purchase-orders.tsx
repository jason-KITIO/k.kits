"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  usePurchaseOrders,
  useDeletePurchaseOrder,
} from "@/hooks/use-purchases";
import { toast } from "sonner";
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  Package,
} from "lucide-react";

interface PurchaseOrdersProps {
  organizationId: string;
}

export function PurchaseOrders({ organizationId }: PurchaseOrdersProps) {
  const { data: orders = [], isLoading } = usePurchaseOrders(organizationId);
  const deleteMutation = useDeletePurchaseOrder(organizationId);

  const handleDelete = async (orderId: string) => {
    if (confirm("Supprimer cette commande ?")) {
      try {
        await deleteMutation.mutateAsync(orderId);
        toast.success("Commande supprimée");
      } catch {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      DRAFT: { variant: "secondary" as const, icon: Clock, text: "Brouillon" },
      SENT: { variant: "default" as const, icon: Package, text: "Envoyée" },
      CONFIRMED: {
        variant: "default" as const,
        icon: CheckCircle,
        text: "Confirmée",
      },
      RECEIVED: {
        variant: "default" as const,
        icon: CheckCircle,
        text: "Reçue",
      },
      CANCELLED: {
        variant: "destructive" as const,
        icon: XCircle,
        text: "Annulée",
      },
    };

    const config = variants[status as keyof typeof variants] || variants.DRAFT;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
        <span>{config.text}</span>
      </Badge>
    );
  };

  if (isLoading) return <div>Chargement des commandes...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Commandes d&apos;achat</h2>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucune commande trouvée</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Commande #{order.orderNumber}</span>
                  </div>
                  {getStatusBadge(order.status)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Fournisseur:</span>{" "}
                    {order.supplier?.name}
                  </div>
                  <div>
                    <span className="font-medium">Montant total:</span>{" "}
                    {order.totalAmount.toLocaleString()} FCFA
                  </div>
                  <div>
                    <span className="font-medium">Date commande:</span>{" "}
                    {new Date(order.orderDate).toLocaleDateString()}
                  </div>
                  {order.expectedDate && (
                    <div>
                      <span className="font-medium">Date prévue:</span>{" "}
                      {new Date(order.expectedDate).toLocaleDateString()}
                    </div>
                  )}
                  {order.receivedDate && (
                    <div>
                      <span className="font-medium">Date réception:</span>{" "}
                      {new Date(order.receivedDate).toLocaleDateString()}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Articles:</span>{" "}
                    {order.items?.length || 0}
                  </div>
                </div>

                {order.notes && (
                  <div className="text-sm">
                    <span className="font-medium">Notes:</span> {order.notes}
                  </div>
                )}

                {order.items && order.items.length > 0 && (
                  <div className="border rounded p-3">
                    <h4 className="font-medium mb-2">Articles commandés:</h4>
                    <div className="space-y-1">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {item.product?.name} ({item.product?.sku})
                          </span>
                          <span>
                            {item.quantity} × {item.unitPrice.toLocaleString()}{" "}
                            FCFA
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(order.id)}
                    disabled={deleteMutation.isPending}
                  >
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
