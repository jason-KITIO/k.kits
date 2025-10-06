"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { Stock } from "@/types/stock";
import { stockMovementAdjustmentSchema, type StockMovementAdjustmentInput } from "@/schema";

interface StockAdjustmentDialogProps {
  stock: Stock;
  onSubmit: (data: StockMovementAdjustmentInput) => Promise<void>;
  isLoading?: boolean;
}

export function StockAdjustmentDialog({ stock, onSubmit, isLoading }: StockAdjustmentDialogProps) {
  const [open, setOpen] = useState(false);
  
  const form = useForm<StockMovementAdjustmentInput>({
    resolver: zodResolver(stockMovementAdjustmentSchema),
    defaultValues: {
      productId: stock.productId,
      quantity: 0,
      reason: "",
    },
  });

  const handleSubmit = async (data: StockMovementAdjustmentInput) => {
    await onSubmit(data);
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajuster le stock</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <Label>Produit</Label>
            <div className="text-sm text-muted-foreground">
              {stock.product.name} (Stock actuel: {stock.quantity})
            </div>
          </div>
          
          <div>
            <Label htmlFor="quantity">Quantité d'ajustement</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="Ex: +10 ou -5"
              {...form.register("quantity", { valueAsNumber: true })}
            />
            <div className="text-xs text-muted-foreground mt-1">
              Utilisez + pour ajouter, - pour retirer
            </div>
          </div>
          
          <div>
            <Label htmlFor="reason">Motif</Label>
            <Textarea
              id="reason"
              placeholder="Raison de l'ajustement..."
              {...form.register("reason")}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Ajustement..." : "Ajuster"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}