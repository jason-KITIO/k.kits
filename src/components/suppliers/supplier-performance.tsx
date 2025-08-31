"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSuppliers, usePurchaseOrders } from "@/hooks/use-purchases";
import { TrendingUp, Package, Clock, CheckCircle } from "lucide-react";

interface SupplierPerformanceProps {
  organizationId: string;
}

export function SupplierPerformance({
  organizationId,
}: SupplierPerformanceProps) {
  const { data: suppliers = [], isLoading: loadingSuppliers } =
    useSuppliers(organizationId);
  const { data: orders = [], isLoading: loadingOrders } =
    usePurchaseOrders(organizationId);

  const getSupplierStats = (supplierId: string) => {
    const supplierOrders = orders.filter(
      (order) => order.supplierId === supplierId
    );
    const totalOrders = supplierOrders.length;
    const completedOrders = supplierOrders.filter(
      (order) => order.status === "RECEIVED"
    ).length;
    const totalAmount = supplierOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const onTimeDeliveries = supplierOrders.filter(
      (order) =>
        order.receivedDate &&
        order.expectedDate &&
        new Date(order.receivedDate) <= new Date(order.expectedDate)
    ).length;

    return {
      totalOrders,
      completedOrders,
      totalAmount,
      onTimeRate:
        totalOrders > 0
          ? ((onTimeDeliveries / totalOrders) * 100).toFixed(1)
          : 0,
      completionRate:
        totalOrders > 0
          ? ((completedOrders / totalOrders) * 100).toFixed(1)
          : 0,
    };
  };

  if (loadingSuppliers || loadingOrders)
    return <div>Chargement des performances...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Performance des fournisseurs</h2>

      {suppliers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Aucune donnée de performance disponible
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {suppliers.map((supplier) => {
            const stats = getSupplierStats(supplier.id);

            return (
              <Card key={supplier.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>{supplier.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Package className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold">
                        {stats.totalOrders}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Commandes
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold">
                        {stats.completionRate}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Taux de livraison
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Clock className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="text-2xl font-bold">
                        {stats.onTimeRate}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Ponctualité
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold">
                        {stats.totalAmount.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        FCFA total
                      </div>
                    </div>
                  </div>

                  {stats.totalOrders === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      Aucune commande passée avec ce fournisseur
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
