"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreatePurchaseOrder, useSuppliers } from "@/hooks/use-purchases";
import { useProducts } from "@/hooks/use-products";
import { CreatePurchaseOrderData } from "@/types/purchase";
import { Plus, Trash2, ShoppingCart } from "lucide-react";

interface CreatePurchaseOrderProps {
  organizationId: string;
}

export function CreatePurchaseOrder({
  organizationId,
}: CreatePurchaseOrderProps) {
  const [orderData, setOrderData] = useState({
    supplierId: "",
    expectedDate: "",
    notes: "",
  });

  const [items, setItems] = useState([
    { productId: "", quantity: 1, unitPrice: 0 },
  ]);

  const { data: suppliers = [] } = useSuppliers(organizationId);
  const { data: products = [] } = useProducts(organizationId);
  const createMutation = useCreatePurchaseOrder(organizationId);

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: unknown) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validItems = items.filter(
      (item) => item.productId && item.quantity > 0 && item.unitPrice > 0
    );

    if (validItems.length === 0) {
      toast.error("Ajoutez au moins un article valide");
      return;
    }

    const data: CreatePurchaseOrderData = {
      supplierId: orderData.supplierId,
      expectedDate: orderData.expectedDate || undefined,
      notes: orderData.notes || undefined,
      items: validItems,
    };

    try {
      await createMutation.mutateAsync(data);
      toast.success("Commande créée avec succès");
      setOrderData({ supplierId: "", expectedDate: "", notes: "" });
      setItems([{ productId: "", quantity: 1, unitPrice: 0 }]);} catch {
      toast.error("Erreur lors de la création de la commande");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Créer une commande d&apos;achat</h2>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Nouvelle commande</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="supplierId">Fournisseur *</Label>
                <Select
                  value={orderData.supplierId}
                  onValueChange={(value) =>
                    setOrderData({ ...orderData, supplierId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un fournisseur" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="expectedDate">Date de livraison prévue</Label>
                <Input
                  id="expectedDate"
                  type="date"
                  value={orderData.expectedDate}
                  onChange={(e) =>
                    setOrderData({ ...orderData, expectedDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={orderData.notes}
                onChange={(e) =>
                  setOrderData({ ...orderData, notes: e.target.value })
                }
                placeholder="Instructions ou commentaires..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-lg">Articles à commander</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un article
                </Button>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-2 items-end"
                  >
                    <div className="col-span-5">
                      <Label>Produit</Label>
                      <Select
                        value={item.productId}
                        onValueChange={(value) =>
                          updateItem(index, "productId", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un produit" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} ({product.sku})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-2">
                      <Label>Quantité</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", Number(e.target.value))
                        }
                      />
                    </div>

                    <div className="col-span-3">
                      <Label>Prix unitaire (FCFA)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(index, "unitPrice", Number(e.target.value))
                        }
                      />
                    </div>

                    <div className="col-span-1">
                      <Label>Total</Label>
                      <div className="text-sm font-medium p-2">
                        {(item.quantity * item.unitPrice).toLocaleString()}
                      </div>
                    </div>

                    <div className="col-span-1">
                      {items.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-muted rounded">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total de la commande:</span>
                  <span className="text-lg font-bold">
                    {calculateTotal().toLocaleString()} FCFA
                  </span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full"
            >
              {createMutation.isPending ? "Création..." : "Créer la commande"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
