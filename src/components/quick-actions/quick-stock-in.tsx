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
import { useProducts } from "@/hooks/use-products";
import { useWarehouses } from "@/hooks/use-warehouses";
import { toast } from "sonner";
import { TrendingUp } from "lucide-react";

interface QuickStockInProps {
  organizationId: string;
}

export function QuickStockIn({ organizationId }: QuickStockInProps) {
  const [formData, setFormData] = useState({
    productId: "",
    warehouseId: "",
    quantity: 1,
    notes: "",
  });

  const { data: products = [] } = useProducts(organizationId);
  const { data: warehouses = [] } = useWarehouses(organizationId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.productId ||
      !formData.warehouseId ||
      formData.quantity <= 0
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      // Simulation d&apos;appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Entrée de stock enregistrée");
      setFormData({
        productId: "",
        warehouseId: "",
        quantity: 1,
        notes: "",
      });
    } catch {
      toast.error("Erreur lors de l&apos;entrée de stock");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Entrée de stock rapide</h2>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Ajouter du stock</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="productId">Produit *</Label>
              <Select
                value={formData.productId}
                onValueChange={(value) =>
                  setFormData({ ...formData, productId: value })
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

            <div>
              <Label htmlFor="warehouseId">Entrepôt *</Label>
              <Select
                value={formData.warehouseId}
                onValueChange={(value) =>
                  setFormData({ ...formData, warehouseId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un entrepôt" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity">Quantité *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: Number(e.target.value) })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Commentaires..."
              />
            </div>

            <Button type="submit" className="w-full">
              Enregistrer l&apos;entrée
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
