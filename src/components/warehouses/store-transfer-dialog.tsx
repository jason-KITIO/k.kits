"use client";

import { useState } from "react";
import { useStores, useWarehouseToStoreTransfer } from "@/hooks/use-stores";
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
import { ArrowRight, Store } from "lucide-react";
import { toast } from "sonner";

interface StoreTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  warehouseId: string;
  warehouseName: string;
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

export function StoreTransferDialog({
  open,
  onOpenChange,
  organizationId,
  warehouseId,
  warehouseName,
  stock,
}: StoreTransferDialogProps) {
  const [toStoreId, setToStoreId] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<Record<string, number>>({});
  const [reason, setReason] = useState("");

  const { data: stores } = useStores(organizationId);
  const createTransfer = useWarehouseToStoreTransfer(organizationId, warehouseId);

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
    if (!toStoreId || Object.keys(selectedProducts).length === 0) return;

    const items = Object.entries(selectedProducts).map(([productId, quantity]) => ({
      productId,
      quantity,
    }));

    try {
      await createTransfer.mutateAsync({
        toStoreId,
        items,
        reason: reason || "Transfert manuel",
      });
      
      onOpenChange(false);
      setToStoreId("");
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
            <Store className="h-5 w-5" />
            Transférer vers une boutique
          </DialogTitle>
          <DialogDescription>
            Transférer des produits depuis {warehouseName} vers une boutique
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="store">Boutique de destination</Label>
            <Select value={toStoreId} onValueChange={setToStoreId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une boutique" />
              </SelectTrigger>
              <SelectContent>
                {stores?.map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{store.name}</span>
                      {store.address && (
                        <span className="text-xs text-muted-foreground ml-2">
                          {store.address}
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
              !toStoreId || 
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