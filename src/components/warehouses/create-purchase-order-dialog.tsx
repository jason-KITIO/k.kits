"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreatePurchaseOrder, useSuppliers, useProducts } from "@/hooks/use-warehouses";
import { useCurrencyFormatter } from "@/hooks/use-currency";
import {
  purchaseOrderCreateSchema,
  type PurchaseOrderCreateInput,
} from "@/schema/purchase-order.schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

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
    if (selectedProduct) {
      form.setValue(`items.${index}.unitPrice`, Number(selectedProduct.unitPrice));
    }
  };

  const watchedItems = form.watch('items');
  const totalAmount = watchedItems?.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice);
  }, 0) || 0;

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
                <FormItem>
                  <FormLabel>Fournisseur</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un fournisseur" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {suppliersLoading ? (
                        <SelectItem value="" disabled>
                          Chargement...
                        </SelectItem>
                      ) : suppliers && suppliers.length > 0 ? (
                        suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>
                          Aucun fournisseur disponible
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expectedDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date de livraison prévue</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP", { locale: fr })
                          ) : (
                            <span>Sélectionner une date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date?.toISOString())}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Articles</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({ productId: "", quantity: 1, unitPrice: 0 })
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-end">
                    <FormField
                      control={form.control}
                      name={`items.${index}.productId`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Produit</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleProductChange(value, index);
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Produit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {productsLoading ? (
                                <SelectItem value="" disabled>
                                  Chargement...
                                </SelectItem>
                              ) : products && products.length > 0 ? (
                                products.map((product) => (
                                  <SelectItem key={product.id} value={product.id}>
                                    <div className="flex justify-between items-start w-full">
                                      <div className="flex flex-col items-start">
                                        <span className="font-medium">{product.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                          SKU: {product.sku}
                                          {product.category && ` • ${product.category.name}`}
                                        </span>
                                      </div>
                                      <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                        {formatCurrency(product.unitPrice)}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="" disabled>
                                  Aucun produit disponible
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem className="w-24">
                          <FormLabel>Qté</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 1)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.unitPrice`}
                      render={({ field }) => (
                        <FormItem className="w-32">
                          <FormLabel>Prix unitaire</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              value={field.value || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(value === '' ? 0 : Number(value));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Récapitulatif */}
            {watchedItems && watchedItems.length > 0 && totalAmount > 0 && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      {watchedItems.length} article(s) - {watchedItems.reduce((sum, item) => sum + item.quantity, 0)} unité(s)
                    </div>
                    <div className="text-lg font-semibold text-foreground">
                      Total: {formatCurrency(totalAmount)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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
