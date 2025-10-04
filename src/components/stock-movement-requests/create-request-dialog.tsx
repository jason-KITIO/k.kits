"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { useCreateStockRequest } from "@/hooks/use-stock-movement-requests";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { stockMovementRequestCreateSchema, type StockMovementRequestCreateInput } from "@/schema/stock-movement-request.schema";

interface CreateRequestDialogProps {
  organizationId: string;
  storeId: string;
}

export function CreateRequestDialog({
  organizationId,
  storeId,
}: CreateRequestDialogProps) {
  const [open, setOpen] = useState(false);
  
  const { data: products } = useProducts(organizationId);
  const createRequest = useCreateStockRequest(organizationId, storeId);
  
  const form = useForm<StockMovementRequestCreateInput>({
    resolver: zodResolver(stockMovementRequestCreateSchema),
    defaultValues: {
      productId: "",
      quantity: 1,
      urgencyLevel: "MEDIUM",
      reason: "",
    },
  });

  const onSubmit = (data: StockMovementRequestCreateInput) => {
    createRequest.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle demande
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Demander du stock</DialogTitle>
          <DialogDescription>
            Créer une nouvelle demande de transfert de stock
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="productId">Produit</Label>
            <Select
              value={form.watch("productId")}
              onValueChange={(value) => form.setValue("productId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un produit" />
              </SelectTrigger>
              <SelectContent>
                {products?.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} ({product.sku})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="quantity">Quantité</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              {...form.register("quantity", { valueAsNumber: true })}
            />
          </div>
          
          <div>
            <Label htmlFor="urgencyLevel">Niveau d'urgence</Label>
            <Select
              value={form.watch("urgencyLevel")}
              onValueChange={(value) => form.setValue("urgencyLevel", value as "LOW" | "MEDIUM" | "HIGH")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Faible</SelectItem>
                <SelectItem value="MEDIUM">Moyenne</SelectItem>
                <SelectItem value="HIGH">Élevée</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="reason">Motif (optionnel)</Label>
            <Textarea
              id="reason"
              placeholder="Raison de la demande..."
              {...form.register("reason")}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={createRequest.isPending}>
              {createRequest.isPending ? "Envoi..." : "Envoyer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}