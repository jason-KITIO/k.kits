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
import { Badge } from "@/components/ui/badge";
import { useStockReport } from "@/hooks/use-reports";
import { useWarehouses } from "@/hooks/use-warehouses";
import { Package, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

interface StockReportProps {
  organizationId: string;
}

export function StockReport({ organizationId }: StockReportProps) {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>("");

  const { data: warehouses = [] } = useWarehouses(organizationId);
  const { data: stockData = [], isLoading } = useStockReport(
    organizationId,
    selectedWarehouseId || undefined
  );

  const getStockStatus = (current: number, min: number) => {
    if (current === 0)
      return {
        status: "out",
        color: "text-red-600",
        icon: AlertTriangle,
        text: "Rupture",
      };
    if (current <= min)
      return {
        status: "low",
        color: "text-orange-600",
        icon: AlertTriangle,
        text: "Stock bas",
      };
    return {
      status: "ok",
      color: "text-green-600",
      icon: CheckCircle,
      text: "Normal",
    };
  };

  const totalValue = stockData.reduce((sum, item) => sum + item.stockValue, 0);
  const lowStockCount = stockData.filter(
    (item) => item.currentStock <= item.minStock && item.currentStock > 0
  ).length;
  const outOfStockCount = stockData.filter(
    (item) => item.currentStock === 0
  ).length;

  if (isLoading) return <div>Chargement du rapport...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Rapport de stock général</h2>
        <Select
          value={selectedWarehouseId}
          onValueChange={setSelectedWarehouseId}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Tous les entrepôts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les entrepôts</SelectItem>
            {warehouses.map((warehouse) => (
              <SelectItem key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total produits
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockData.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur totale</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalValue.toLocaleString()} FCFA
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock bas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {lowStockCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ruptures</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {outOfStockCount}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détail du stock</CardTitle>
        </CardHeader>
        <CardContent>
          {stockData.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucune donnée de stock disponible
            </p>
          ) : (
            <div className="space-y-2">
              {stockData.map((item, index) => {
                const status = getStockStatus(item.currentStock, item.minStock);
                const StatusIcon = status.icon;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div className="flex items-center space-x-4">
                      <StatusIcon className={`h-5 w-5 ${status.color}`} />
                      <div>
                        <span className="font-medium">{item.productName}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({item.sku})
                        </span>
                        {item.warehouseName && (
                          <span className="text-sm text-muted-foreground ml-2">
                            - {item.warehouseName}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                      <div>
                        <span className="font-medium">Stock:</span>{" "}
                        {item.currentStock}
                      </div>
                      <div>
                        <span className="font-medium">Min:</span>{" "}
                        {item.minStock}
                      </div>
                      <div>
                        <span className="font-medium">Valeur:</span>{" "}
                        {item.stockValue.toLocaleString()} FCFA
                      </div>
                      <Badge
                        variant={
                          status.status === "ok" ? "default" : "destructive"
                        }
                      >
                        {status.text}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
