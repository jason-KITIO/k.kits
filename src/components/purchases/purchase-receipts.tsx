"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePurchaseOrders } from "@/hooks/use-purchases";
import { Package, CheckCircle, Clock } from "lucide-react";

interface PurchaseReceiptsProps {
  organizationId: string;
}

export function PurchaseReceipts({ organizationId }: PurchaseReceiptsProps) {
  const { data: orders = [], isLoading } = usePurchaseOrders(organizationId);

  const receivedOrders = orders.filter((order) => order.status === "RECEIVED");
  const pendingOrders = orders.filter((order) =>
    ["SENT", "CONFIRMED"].includes(order.status)
  );

  const getReceiptStatus = (order: unknown) => {
    if (!order.items) return "N/A";
    const receivedItems = order.items.filter(
      (item: unknown) => item.receivedQty > 0
    ).length;
    const fullyReceived = order.items.every(
      (item: unknown) => item.receivedQty >= item.quantity
    );

    if (fullyReceived) {
      return {
        status: "complete",
        text: "Complet",
        variant: "default" as const,
        icon: CheckCircle,
      };
    } else if (receivedItems > 0) {
      return {
        status: "partial",
        text: "Partiel",
        variant: "secondary" as const,
        icon: Clock,
      };
    }
    return {
      status: "pending",
      text: "En attente",
      variant: "secondary" as const,
      icon: Clock,
    };
  };

  if (isLoading) return <div>Chargement des réceptions...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Réceptions de commandes</h2>

      <div>
        <h3 className="text-lg font-semibold mb-4">Commandes reçues</h3>
        {receivedOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune commande reçue</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {receivedOrders.map((order) => {
              const receiptStatus = getReceiptStatus(order);
              const StatusIcon = receiptStatus.icon;

              return (
                <Card key={order.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Package className="h-5 w-5" />
                        <span>Commande #{order.orderNumber}</span>
                      </div>
                      <Badge
                        variant={receiptStatus.variant}
                        className="flex items-center space-x-1"
                      >
                        <StatusIcon className="h-3 w-3" />
                        <span>{receiptStatus.text}</span>
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Fournisseur:</span>{" "}
                        {order.supplier?.name}
                      </div>
                      <div>
                        <span className="font-medium">Date réception:</span>{" "}
                        {order.receivedDate
                          ? new Date(order.receivedDate).toLocaleDateString()
                          : "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Montant:</span>{" "}
                        {order.totalAmount.toLocaleString()} FCFA
                      </div>
                      <div>
                        <span className="font-medium">Articles:</span>{" "}
                        {order.items?.length || 0}
                      </div>
                    </div>

                    {order.items && order.items.length > 0 && (
                      <div className="border rounded p-3">
                        <h4 className="font-medium mb-2">
                          Détail de la réception:
                        </h4>
                        <div className="space-y-1">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between text-sm"
                            >
                              <span>{item.product?.name}</span>
                              <span>
                                Reçu: {item.receivedQty} / Commandé:{" "}
                                {item.quantity}
                                {item.receivedQty >= item.quantity ? (
                                  <CheckCircle className="inline h-3 w-3 ml-1 text-green-600" />
                                ) : (
                                  <Clock className="inline h-3 w-3 ml-1 text-orange-600" />
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">En attente de réception</h3>
        {pendingOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Aucune commande en attente
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5" />
                      <span>Commande #{order.orderNumber}</span>
                    </div>
                    <Badge variant="secondary">En attente</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Fournisseur:</span>{" "}
                      {order.supplier?.name}
                    </div>
                    <div>
                      <span className="font-medium">Date prévue:</span>{" "}
                      {order.expectedDate
                        ? new Date(order.expectedDate).toLocaleDateString()
                        : "Non définie"}
                    </div>
                    <div>
                      <span className="font-medium">Montant:</span>{" "}
                      {order.totalAmount.toLocaleString()} FCFA
                    </div>
                    <div>
                      <span className="font-medium">Articles:</span>{" "}
                      {order.items?.length || 0}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
