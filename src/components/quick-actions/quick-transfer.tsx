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
import { ArrowRightLeft } from "lucide-react";

interface QuickTransferProps {
  organizationId: string;
}

export function QuickTransfer({ organizationId }: QuickTransferProps) {
  const [formData, setFormData] = useState({
    productId: "",
    sourceWarehouseId: "",
    destWarehouseId: "",
    quantity: 1,
    notes: "",
  });

  const { data: products = [] } = useProducts(organizationId);
  const { data: warehouses = [] } = useWarehouses(organizationId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.productId ||
      !formData.sourceWarehouseId ||
      !formData.destWarehouseId ||
      formData.quantity <= 0
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (formData.sourceWarehouseId === formData.destWarehouseId) {
      toast.error("L'entrepôt source et destination doivent être différents");
      return;
    }

    try {
      // Simulation d'appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Transfert créé avec succès");
      setFormData({
        productId: "",
        sourceWarehouseId: "",
        destWarehouseId: "",
        quantity: 1,
        notes: "",
      });
    } catch {
      toast.error("Erreur lors de la création du transfert");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Transfert rapide</h2>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ArrowRightLeft className="h-5 w-5" />
            <span>Créer un transfert</span>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sourceWarehouseId">Entrepôt source *</Label>
                <Select
                  value={formData.sourceWarehouseId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, sourceWarehouseId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Source" />
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
                <Label htmlFor="destWarehouseId">Entrepôt destination *</Label>
                <Select
                  value={formData.destWarehouseId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, destWarehouseId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Destination" />
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
                placeholder="Raison du transfert..."
              />
            </div>

            <Button type="submit" className="w-full">
              Créer le transfert
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
