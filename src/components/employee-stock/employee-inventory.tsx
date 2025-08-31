"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useEmployeeStock,
  useAdjustEmployeeStock,
} from "@/hooks/use-employee-stock";
import { Package, AlertTriangle, CheckCircle, Settings } from "lucide-react";

interface EmployeeInventoryProps {
  organizationId: string;
}

export function EmployeeInventory({ organizationId }: EmployeeInventoryProps) {
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [adjustmentData, setAdjustmentData] = useState({
    newQuantity: 0,
    reason: "",
    notes: "",
  });

  const { data: stock = [], isLoading } = useEmployeeStock(organizationId);
  const adjustMutation = useAdjustEmployeeStock(organizationId);

  const handleAdjust = (stockItem: unknown) => {
    setSelectedStock(stockItem);
    setAdjustmentData({
      newQuantity: stockItem.quantity,
      reason: "",
      notes: "",
    });
    setIsAdjustModalOpen(true);
  };

  const handleSubmitAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock) return;

    try {
      await adjustMutation.mutateAsync({
        productId: selectedStock.productId,
        ...adjustmentData,
      });
      toast.success("Ajustement effectué avec succès");
      setIsAdjustModalOpen(false);} catch {
      toast.error("Erreur lors de l'ajustement");
    }
  };

  const getStockStatus = (quantity: number, minStock: number = 0) => {
    if (quantity === 0)
      return { status: "out", icon: AlertTriangle, color: "text-red-500" };
    if (quantity <= minStock)
      return { status: "low", icon: AlertTriangle, color: "text-orange-500" };
    return { status: "ok", icon: CheckCircle, color: "text-green-500" };
  };

  if (isLoading) return <div>Chargement de votre inventaire...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Mon inventaire</h2>

      {stock.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Aucun stock personnel trouvé
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stock.map((item) => {
            const stockInfo = getStockStatus(
              item.quantity,
              item.product?.minStock
            );
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
                      <span className="font-medium">Unité:</span>{" "}
                      {item.product?.unit}
                    </div>
                    <div>
                      <span className="font-medium">Quantité:</span>{" "}
                      {item.quantity}
                    </div>
                    <div>
                      <span className="font-medium">Réservé:</span>{" "}
                      {item.reservedQty}
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Disponible:</span>{" "}
                    {item.quantity - item.reservedQty}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => handleAdjust(item)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Ajuster
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isAdjustModalOpen} onOpenChange={setIsAdjustModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Ajuster le stock - {selectedStock?.product?.name}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitAdjustment} className="space-y-4">
            <div>
              <Label>Quantité actuelle: {selectedStock?.quantity}</Label>
            </div>
            <div>
              <Label htmlFor="newQuantity">Nouvelle quantité *</Label>
              <Input
                id="newQuantity"
                type="number"
                value={adjustmentData.newQuantity}
                onChange={(e) =>
                  setAdjustmentData({
                    ...adjustmentData,
                    newQuantity: Number(e.target.value),
                  })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="reason">Raison *</Label>
              <Input
                id="reason"
                value={adjustmentData.reason}
                onChange={(e) =>
                  setAdjustmentData({
                    ...adjustmentData,
                    reason: e.target.value,
                  })
                }
                placeholder="Ex: Inventaire physique, Perte, Casse..."
                required
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={adjustmentData.notes}
                onChange={(e) =>
                  setAdjustmentData({
                    ...adjustmentData,
                    notes: e.target.value,
                  })
                }
                placeholder="Commentaires additionnels..."
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAdjustModalOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={adjustMutation.isPending}>
                {adjustMutation.isPending ? "Ajustement..." : "Ajuster"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
