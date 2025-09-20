"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateStockReturn } from "@/hooks/use-stock-returns";
import { stockReturnUpdateSchema } from "@/schema/stock-return.schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { StockReturnWithRelations } from "@/types/stock-return";
import type { StockReturnUpdateInput } from "@/schema/stock-return.schema";

interface ProcessReturnDialogProps {
  organizationId: string;
  storeId: string;
  returnItem: StockReturnWithRelations;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProcessReturnDialog({
  organizationId,
  storeId,
  returnItem,
  open,
  onOpenChange,
}: ProcessReturnDialogProps) {
  const form = useForm({
    resolver: zodResolver(stockReturnUpdateSchema),
    defaultValues: {
      status: "INSPECTED",
    },
  });

  const updateReturn = useUpdateStockReturn(organizationId, storeId);

  const onSubmit = (data: StockReturnUpdateInput) => {
    updateReturn.mutate(
      { returnId: returnItem.id, data },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Traiter le Retour</DialogTitle>
        </DialogHeader>

        <div className="mb-4 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Détails du retour</h4>
          <p className="text-sm text-muted-foreground">
            Produit: {returnItem.product.name} ({returnItem.quantity} unités)
          </p>
          <p className="text-sm text-muted-foreground">
            Condition: {returnItem.condition}
          </p>
          <p className="text-sm text-muted-foreground">
            Retourné par: {returnItem.employee.firstName} {returnItem.employee.lastName}
          </p>
          <p className="text-sm mt-2">{returnItem.returnReason}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">


            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="RECEIVED">Reçu</SelectItem>
                      <SelectItem value="INSPECTED">Inspecté</SelectItem>
                      <SelectItem value="RESTOCKED">Remis en stock</SelectItem>
                      <SelectItem value="DAMAGED">Endommagé</SelectItem>
                      <SelectItem value="RETURNED_TO_WAREHOUSE">Retourné à l'entrepôt</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={updateReturn.isPending}>
                {updateReturn.isPending ? "Traitement..." : "Confirmer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}