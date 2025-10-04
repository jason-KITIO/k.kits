"use client";

import { useState } from "react";
import { useDeleteWarehouse, useWarehouses } from "@/hooks/use-warehouses";
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
import { AlertTriangle, Package, ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DeleteWarehouseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warehouseId: string;
  warehouseName: string;
  organizationId: string;
  onSuccess?: () => void;
}

export function DeleteWarehouseDialog({
  open,
  onOpenChange,
  warehouseId,
  warehouseName,
  organizationId,
  onSuccess,
}: DeleteWarehouseDialogProps) {
  console.log('DeleteWarehouseDialog - warehouseId:', warehouseId); // Debug
  const [step, setStep] = useState<"confirm" | "options">("confirm");
  const [selectedOption, setSelectedOption] = useState<"transfer" | "force">();
  const [transferWarehouseId, setTransferWarehouseId] = useState<string>();
  const [stockInfo, setStockInfo] = useState<any>();

  const deleteWarehouse = useDeleteWarehouse(organizationId);
  const { data: warehouses } = useWarehouses(organizationId);

  const handleInitialDelete = async () => {
    try {
      await deleteWarehouse.mutateAsync({ warehouseId });
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      if (error.status === 409) {
        setStockInfo(error.data);
        setStep("options");
      }
    }
  };

  const handleFinalDelete = async () => {
    try {
      if (selectedOption === "transfer" && transferWarehouseId) {
        await deleteWarehouse.mutateAsync({
          warehouseId,
          transferToWarehouseId: transferWarehouseId,
        });
      } else if (selectedOption === "force") {
        await deleteWarehouse.mutateAsync({
          warehouseId,
          forceDelete: true,
        });
      }
      onOpenChange(false);
      onSuccess?.();
      setStep("confirm");
      setSelectedOption(undefined);
      setTransferWarehouseId(undefined);
      setStockInfo(undefined);
    } catch (error) {
      // Erreur gérée par le hook
    }
  };

  const availableWarehouses = stockInfo?.options?.transfer || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === "confirm" ? (
          <>
            <DialogHeader>
              <DialogTitle>Supprimer l'entrepôt</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer l'entrepôt "{warehouseName}" ?
                Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={handleInitialDelete}
                disabled={deleteWarehouse.isPending}
              >
                {deleteWarehouse.isPending ? "Suppression..." : "Supprimer"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Entrepôt contient du stock
              </DialogTitle>
              <DialogDescription>
                Cet entrepôt contient {stockInfo?.stockCount} produit(s) avec un total de{" "}
                {stockInfo?.totalQuantity} unités. Choisissez une option :
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Alert>
                <Package className="h-4 w-4" />
                <AlertDescription>
                  {stockInfo?.stockCount} produit(s) • {stockInfo?.totalQuantity} unités
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="transfer"
                    name="option"
                    value="transfer"
                    checked={selectedOption === "transfer"}
                    onChange={(e) => setSelectedOption(e.target.value as "transfer")}
                    disabled={availableWarehouses.length === 0}
                  />
                  <Label htmlFor="transfer" className="flex-1">
                    Transférer vers un autre entrepôt
                  </Label>
                </div>

                {selectedOption === "transfer" && (
                  <div className="ml-6">
                    <Select value={transferWarehouseId} onValueChange={setTransferWarehouseId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un entrepôt" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableWarehouses.map((warehouse: any) => (
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
                )}

                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="force"
                    name="option"
                    value="force"
                    checked={selectedOption === "force"}
                    onChange={(e) => setSelectedOption(e.target.value as "force")}
                  />
                  <Label htmlFor="force" className="flex-1 text-red-600">
                    Supprimer avec tout le stock (irréversible)
                  </Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={handleFinalDelete}
                disabled={
                  !selectedOption ||
                  (selectedOption === "transfer" && !transferWarehouseId) ||
                  deleteWarehouse.isPending
                }
              >
                {deleteWarehouse.isPending ? "Suppression..." : "Confirmer"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}