"use client";

import { useParams, useRouter } from "next/navigation";
import { useCreateSale, useStoreCustomers, useStoreProducts } from "@/hooks/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ShoppingCart, Plus, Trash2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function NewSalePage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.id as string;
  const storeId = params.storeId as string;
  
  const [saleData, setSaleData] = useState({
    customerId: "",
    items: [{ productId: "", quantity: 1, unitPrice: 0 }],
  });

  const createSale = useCreateSale(organizationId, storeId);
  const { data: customers } = useStoreCustomers(organizationId, storeId);
  const { data: products } = useStoreProducts(organizationId, storeId);

  const addItem = () => {
    setSaleData(prev => ({
      ...prev,
      items: [...prev.items, { productId: "", quantity: 1, unitPrice: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    setSaleData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    setSaleData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const totalAmount = saleData.items.reduce((sum, item) => 
    sum + (item.quantity * item.unitPrice), 0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...saleData,
        customerId: saleData.customerId === "__no_customer__" ? "" : saleData.customerId
      };
      await createSale.mutateAsync(submitData);
      toast.success("Vente créée avec succès");
      router.push(`/preferences/organizations/${organizationId}/stores/${storeId}/sales`);
    } catch (error) {
      toast.error("Erreur lors de la création de la vente");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/preferences/organizations/${organizationId}/stores/${storeId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nouvelle vente</h1>
          <p className="text-muted-foreground">
            Enregistrer une nouvelle transaction de vente
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Informations de la vente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Client (optionnel)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link href={`/preferences/organizations/${organizationId}/stores/${storeId}/customers/new`}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Nouveau client
                  </Link>
                </Button>
              </div>
              <Select
                value={saleData.customerId}
                onValueChange={(value) => setSaleData(prev => ({ ...prev, customerId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client ou laisser vide" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__no_customer__">Vente comptoir (sans client)</SelectItem>
                  {customers?.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} {customer.email && `(${customer.email})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Articles</CardTitle>
              <Button type="button" onClick={addItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un article
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {saleData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-5">
                  <Label>Produit</Label>
                  <Select
                    value={item.productId}
                    onValueChange={(value) => {
                      const product = products?.find(p => p.id === value);
                      updateItem(index, "productId", value);
                      if (product) {
                        updateItem(index, "unitPrice", product.unitPrice);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un produit" />
                    </SelectTrigger>
                    <SelectContent>
                      {products?.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - {product.unitPrice} FCFA
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
                    onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 1)}
                    required
                  />
                </div>
                <div className="col-span-3">
                  <Label>Prix unitaire</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, "unitPrice", parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <Label>Total</Label>
                  <div className="text-sm font-medium p-2">
                    {(item.quantity * item.unitPrice).toFixed(2)} FCFA
                  </div>
                </div>
                <div className="col-span-1">
                  {saleData.items.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total de la vente:</span>
                <span>{totalAmount.toFixed(2)} FCFA</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="submit" disabled={createSale.isPending}>
            {createSale.isPending ? "Création..." : "Créer la vente"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href={`/preferences/organizations/${organizationId}/stores/${storeId}`}>
              Annuler
            </Link>
          </Button>
        </div>
      </form>
    </div>
  );
}