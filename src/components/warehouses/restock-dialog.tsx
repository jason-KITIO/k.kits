"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProducts } from "@/hooks/use-warehouses";
import { Loader2, Plus, Trash2 } from "lucide-react";

const restockSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1, "Produit requis"),
      quantity: z.number().min(1, "Quantité minimale: 1"),
    })
  ).min(1, "Au moins un produit requis"),
});

type RestockFormData = z.infer<typeof restockSchema>;

interface RestockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  warehouseId: string;
}

export function RestockDialog({
  open,
  onOpenChange,
  organizationId,
  warehouseId,
}: RestockDialogProps) {
  const queryClient = useQueryClient();
  const { data: products } = useProducts(organizationId);
  const [items, setItems] = useState([{ productId: "", quantity: 1 }]);

  const form = useForm<RestockFormData>({
    resolver: zodResolver(restockSchema),
    defaultValues: {
      items: [{ productId: "", quantity: 1 }],
    },
  });

  const restockMutation = useMutation({
    mutationFn: async (data: RestockFormData) => {
      const response = await fetch(
        `/api/organization/${organizationId}/warehouses/${warehouseId}/restock`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Erreur lors du rechargement");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse-stocks", organizationId, warehouseId] });
      queryClient.invalidateQueries({ queryKey: ["warehouse-stock-movements", organizationId, warehouseId] });
      toast.success("Stock rechargé avec succès");
      onOpenChange(false);
      form.reset();
      setItems([{ productId: "", quantity: 1 }]);
    },
    onError: () => {
      toast.error("Erreur lors du rechargement du stock");
    },
  });

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const onSubmit = (data: RestockFormData) => {
    restockMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Recharger les produits</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex gap-2 items-end">
                <FormField
                  control={form.control}
                  name={`items.${index}.productId`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Produit</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un produit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {products?.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} ({product.sku})
                            </SelectItem>
                          ))}
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
                    <FormItem className="w-32">
                      <FormLabel>Quantité</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addItem}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un produit
            </Button>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={restockMutation.isPending}>
                {restockMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Recharger
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
