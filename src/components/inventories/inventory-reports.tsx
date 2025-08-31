"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventories } from "@/hooks/use-inventories";
import { BarChart3, TrendingUp, TrendingDown, Target } from "lucide-react";

interface InventoryReportsProps {
  organizationId: string;
}

export function InventoryReports({ organizationId }: InventoryReportsProps) {
  const { data: inventories = [], isLoading } = useInventories(organizationId);

  const completedInventories = inventories.filter(
    (inv) => inv.status === "COMPLETED"
  );

  const stats = {
    total: completedInventories.length,
    withDifferences: completedInventories.filter((inv) => inv.difference !== 0)
      .length,
    overstock: completedInventories.filter((inv) => inv.difference > 0).length,
    understock: completedInventories.filter((inv) => inv.difference < 0).length,
    accurate: completedInventories.filter((inv) => inv.difference === 0).length,
  };

  const accuracyRate =
    stats.total > 0 ? ((stats.accurate / stats.total) * 100).toFixed(1) : 0;

  if (isLoading) return <div>Chargement des rapports...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Rapports d&apos;inventaire</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total inventaires
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Inventaires terminés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taux de précision
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accuracyRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.accurate} sur {stats.total}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Surstock</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.overstock}
            </div>
            <p className="text-xs text-muted-foreground">
              Quantités excédentaires
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sous-stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.understock}
            </div>
            <p className="text-xs text-muted-foreground">
              Quantités manquantes
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détail des écarts</CardTitle>
        </CardHeader>
        <CardContent>
          {completedInventories.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Aucune donnée d&apos;inventaire disponible
            </p>
          ) : (
            <div className="space-y-4">
              {completedInventories
                .filter((inv) => inv.difference !== 0)
                .map((inventory) => (
                  <div
                    key={inventory.id}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div>
                      <span className="font-medium">
                        {inventory.product?.name}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({inventory.product?.sku})
                      </span>
                      {inventory.warehouse && (
                        <span className="text-sm text-muted-foreground ml-2">
                          - {inventory.warehouse.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span>Attendu: {inventory.expectedQty}</span>
                      <span>Réel: {inventory.actualQty}</span>
                      <span
                        className={`font-medium ${
                          inventory.difference > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        Écart: {inventory.difference > 0 ? "+" : ""}
                        {inventory.difference}
                      </span>
                    </div>
                  </div>
                ))}

              {completedInventories.filter((inv) => inv.difference !== 0)
                .length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  Tous les inventaires sont exacts ! 🎉
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
