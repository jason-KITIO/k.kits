"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateEmployeeStock } from "@/hooks/use-employee-stocks";
import { employeeStockUpdateSchema } from "@/schema/employee-stock.schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { EmployeeStockWithRelations } from "@/types/employee-stock";
import type { EmployeeStockUpdateInput } from "@/schema/employee-stock.schema";

interface EditEmployeeStockDialogProps {
  organizationId: string;
  storeId: string;
  stock: EmployeeStockWithRelations;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditEmployeeStockDialog({
  organizationId,
  storeId,
  stock,
  open,
  onOpenChange,
}: EditEmployeeStockDialogProps) {
  const form = useForm<EmployeeStockUpdateInput>({
    resolver: zodResolver(employeeStockUpdateSchema),
    defaultValues: {
      quantity: stock.quantity,
    },
  });

  const updateStock = useUpdateEmployeeStock(organizationId, storeId);

  const onSubmit = (data: EmployeeStockUpdateInput) => {
    updateStock.mutate(
      { employeeStockId: stock.id, data },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le Stock</DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Employé: {stock.employee.firstName} {stock.employee.lastName}
          </p>
          <p className="text-sm text-muted-foreground">
            Produit: {stock.product.name} ({stock.product.sku})
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantité</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={updateStock.isPending}>
                {updateStock.isPending ? "Modification..." : "Modifier"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}