"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWarehouses, useWarehouseStock } from "@/hooks/use-warehouses";
import { Package, AlertTriangle, CheckCircle } from "lucide-react";

interface WarehouseStockProps {
  organizationId: string;
}

export function WarehouseStock({ organizationId }: WarehouseStockProps) {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>("");

  const { data: warehouses = [] } = useWarehouses(organizationId);
  const { data: stock = [], isLoading } = useWarehouseStock(
    organizationId,
    selectedWarehouseId || undefined
  );

  const getStockStatus = (quantity: number, minStock: number = 0) => {
    if (quantity === 0)
      return { status: "out", icon: AlertTriangle, color: "text-red-500" };
    if (quantity <= minStock)
      return { status: "low", icon: AlertTriangle, color: "text-orange-500" };
    return { status: "ok", icon: CheckCircle, color: "text-green-500" };
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Stock entrepôts</h2>
        <Select
          value={selectedWarehouseId}
          onValueChange={setSelectedWarehouseId}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Sélectionner un entrepôt" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les entrepôts</SelectItem>
            {warehouses.map((warehouse) => (
              <SelectItem key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div>Chargement du stock...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stock.map((item) => {
            const stockInfo = getStockStatus(item.quantity);
            const StatusIcon = stockInfo.icon;

            return (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Package className="h-5 w-5" />
                      <span className="text-sm">{item.product?.name}</span>
                    </div>
                    <StatusIcon className={`h-5 w-5 ${stockInfo.color}`} />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">SKU:</span>{" "}
                      {item.product?.sku}
                    </div>
                    <div>
                      <span className="font-medium">Quantité:</span>{" "}
                      {item.quantity}
                    </div>
                    <div>
                      <span className="font-medium">Réservé:</span>{" "}
                      {item.reservedQty}
                    </div>
                    <div>
                      <span className="font-medium">Disponible:</span>{" "}
                      {item.quantity - item.reservedQty}
                    </div>
                  </div>
                  {item.location && (
                    <div className="text-sm">
                      <span className="font-medium">Emplacement:</span>{" "}
                      {item.location.name}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!isLoading && stock.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              {selectedWarehouseId
                ? "Aucun stock trouvé dans cet entrepôt"
                : "Sélectionnez un entrepôt pour voir le stock"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
