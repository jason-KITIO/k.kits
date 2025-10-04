"use client";

import { useState } from "react";
import { useWarehouses, useCreateStockTransfer } from "@/hooks/use-warehouses";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Package } from "lucide-react";

interface StockTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  fromWarehouseId: string;
  fromWarehouseName: string;
  stock: Array<{
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      sku: string;
    };
  }>;
}

export function StockTransferDialog({
  open,
  onOpenChange,
  organizationId,
  fromWarehouseId,
  fromWarehouseName,
  stock,
}: StockTransferDialogProps) {
  const [toWarehouseId, setToWarehouseId] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<Record<string, number>>({});
  const [reason, setReason] = useState("");

  console.log('StockTransferDialog - organizationId:', organizationId); // Debug
  const { data: warehouses } = useWarehouses(organizationId);
  const createTransfer = useCreateStockTransfer(organizationId);
  
  console.log('Warehouses data:', warehouses); // Debug

  const availableWarehouses = warehouses?.filter(w => w.id !== fromWarehouseId) || [];
  console.log('Available warehouses:', availableWarehouses); // Debug
  console.log('fromWarehouseId:', fromWarehouseId); // Debug

  const handleProductQuantityChange = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      const newSelected = { ...selectedProducts };
      delete newSelected[productId];
      setSelectedProducts(newSelected);
    } else {
      setSelectedProducts(prev => ({ ...prev, [productId]: quantity }));
    }
  };

  const handleTransfer = async () => {
    if (!toWarehouseId || Object.keys(selectedProducts).length === 0) return;

    const items = Object.entries(selectedProducts).map(([productId, quantity]) => ({
      productId,
      quantity,
    }));

    try {
      await createTransfer.mutateAsync({
        fromWarehouseId,
        toWarehouseId,
        items,
        reason: reason || "Transfert manuel",
      });
      
      onOpenChange(false);
      setToWarehouseId("");
      setSelectedProducts({});
      setReason("");
    } catch (error) {
      // Erreur gérée par le hook
    }
  };

  const totalItems = Object.keys(selectedProducts).length;
  const totalQuantity = Object.values(selectedProducts).reduce((sum, qty) => sum + qty, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Transférer du stock
          </DialogTitle>
          <DialogDescription>
            Transférer des produits depuis {fromWarehouseName} vers un autre entrepôt
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="warehouse">Entrepôt de destination</Label>
            <Select value={toWarehouseId} onValueChange={setToWarehouseId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un entrepôt" />
              </SelectTrigger>
              <SelectContent>
                {availableWarehouses.map((warehouse) => (
                  <SelectItem key={warehouse.id} value={warehouse.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{warehouse.name}</span>
                      {warehouse.capacity && (
                        <span className="text-xs text-muted-foreground ml-2">
                          Capacité: {warehouse.capacity}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Produits à transférer</Label>
            <div className="border rounded-md max-h-60 overflow-y-auto">
              {stock.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      SKU: {item.product.sku} • Stock: {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      max={item.quantity}
                      value={selectedProducts[item.product.id] || ""}
                      onChange={(e) => handleProductQuantityChange(
                        item.product.id, 
                        parseInt(e.target.value) || 0
                      )}
                      className="w-20"
                      placeholder="0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {totalItems > 0 && (
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm font-medium text-blue-900">
                {totalItems} produit(s) sélectionné(s) • {totalQuantity} unités au total
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="reason">Raison du transfert</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Motif du transfert (optionnel)"
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleTransfer}
            disabled={
              !toWarehouseId || 
              totalItems === 0 || 
              createTransfer.isPending
            }
          >
            {createTransfer.isPending ? "Transfert..." : (
              <>
                <ArrowRight className="h-4 w-4 mr-2" />
                Transférer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}