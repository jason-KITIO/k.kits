"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateStockMovementRequest } from "@/hooks/use-stock-movement-requests";
import { stockMovementRequestCreateSchema } from "@/schema/stock-movement-request.schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { StockMovementRequestCreateInput } from "@/schema/stock-movement-request.schema";

interface CreateStockMovementRequestDialogProps {
  organizationId: string;
  storeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateStockMovementRequestDialog({
  organizationId,
  storeId,
  open,
  onOpenChange,
}: CreateStockMovementRequestDialogProps) {
  const form = useForm<StockMovementRequestCreateInput>({
    resolver: zodResolver(stockMovementRequestCreateSchema),
    defaultValues: {
      productId: "",
      quantity: 1,
      urgencyLevel: "MEDIUM",
      reason: "",
    },
  });

  const createRequest = useCreateStockMovementRequest(organizationId, storeId);

  const onSubmit = (data: StockMovementRequestCreateInput) => {
    createRequest.mutate(data, {
      onSuccess: () => {
        form.reset({
          productId: "",
          quantity: 1,
          urgencyLevel: "MEDIUM",
          reason: "",
        });
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>📦 Demander un Déplacement d'Articles</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="urgencyLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Niveau d'urgence</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="LOW">Faible</SelectItem>
                      <SelectItem value="MEDIUM">Moyenne</SelectItem>
                      <SelectItem value="HIGH">Élevée</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quel produit ?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir le produit..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="prod1">T-shirt Blanc (Stock: 15 unités)</SelectItem>
                      <SelectItem value="prod2">Jean Bleu (Stock: 8 unités)</SelectItem>
                      <SelectItem value="prod3">Baskets Nike (Stock: 3 unités)</SelectItem>
                      <SelectItem value="prod4">Robe Été (Stock: 12 unités)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Combien d'articles ?</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Ex: 5"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pourquoi cette demande ?</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ex: Stock épuisé en vitrine, besoin de réapprovisionner pour les ventes..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={createRequest.isPending} className="bg-blue-600 hover:bg-blue-700">
                {createRequest.isPending ? "Envoi en cours..." : "📤 Envoyer ma demande"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}