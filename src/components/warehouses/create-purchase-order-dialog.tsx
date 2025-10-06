"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreatePurchaseOrder, useSuppliers, useProducts } from "@/hooks/use-warehouses";
import { useCurrencyFormatter } from "@/hooks/use-currency";
import { purchaseOrderCreateSchema, type PurchaseOrderCreateInput } from "@/schema/purchase-order.schema";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { SupplierSelector } from "./purchase-order/SupplierSelector";
import { DateSelector } from "./purchase-order/DateSelector";
import { ProductItemRow } from "./purchase-order/ProductItemRow";
import { OrderSummary } from "./purchase-order/OrderSummary";

interface CreatePurchaseOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  warehouseId: string;
}

export function CreatePurchaseOrderDialog({
  open,
  onOpenChange,
  organizationId,
  warehouseId,
}: CreatePurchaseOrderDialogProps) {
  const createOrder = useCreatePurchaseOrder(organizationId, warehouseId);
  const { data: suppliers, isLoading: suppliersLoading } = useSuppliers(organizationId);
  const { data: products, isLoading: productsLoading } = useProducts(organizationId);
  const formatCurrency = useCurrencyFormatter(organizationId);

  const form = useForm<PurchaseOrderCreateInput>({
    resolver: zodResolver(purchaseOrderCreateSchema),
    defaultValues: {
      supplierId: "",
      warehouseId,
      status: "PENDING",
      items: [{ productId: "", quantity: 1, unitPrice: 0 }],
      expectedDate: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = async (data: PurchaseOrderCreateInput) => {
    try {
      await createOrder.mutateAsync(data);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    }
  };

  const handleProductChange = (productId: string, index: number) => {
    const selectedProduct = products?.find(p => p.id === productId);
    if (selectedProduct) form.setValue(`items.${index}.unitPrice`, Number(selectedProduct.unitPrice));
  };

  const watchedItems = form.watch('items');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une commande d'achat</DialogTitle>
          <DialogDescription>
            Créer une nouvelle commande d'achat auprès d'un fournisseur.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="supplierId"
              render={({ field }) => (
                <SupplierSelector
                  value={field.value}
                  onChange={field.onChange}
                  suppliers={suppliers}
                  isLoading={suppliersLoading}
                />
              )}
            />

            <FormField
              control={form.control}
              name="expectedDate"
              render={({ field }) => (
                <DateSelector value={field.value} onChange={field.onChange} />
              )}
            />

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Articles</CardTitle>
                  <Button type="button" variant="outline" size="sm" onClick={() => append({ productId: "", quantity: 1, unitPrice: 0 })}>
                    <Plus className="h-4 w-4 mr-2" />Ajouter
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`items.${index}`}
                    render={() => (
                      <ProductItemRow
                        index={index}
                        productId={watchedItems[index]?.productId || ""}
                        quantity={watchedItems[index]?.quantity || 1}
                        unitPrice={watchedItems[index]?.unitPrice || 0}
                        products={products}
                        isLoading={productsLoading}
                        onProductChange={handleProductChange}
                        onQuantityChange={(q) => form.setValue(`items.${index}.quantity`, q)}
                        onPriceChange={(p) => form.setValue(`items.${index}.unitPrice`, p)}
                        onRemove={() => remove(index)}
                        canRemove={fields.length > 1}
                        formatCurrency={formatCurrency}
                      />
                    )}
                  />
                ))}
              </CardContent>
            </Card>

            <OrderSummary items={watchedItems || []} formatCurrency={formatCurrency} />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={createOrder.isPending || suppliersLoading || productsLoading}
              >
                {createOrder.isPending ? "Création..." : "Créer la commande"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
