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
import { Bell } from "lucide-react";

interface QuickAlertProps {
  organizationId: string;
}

export function QuickAlert({ organizationId }: QuickAlertProps) {
  const [formData, setFormData] = useState({
    productId: "",
    warehouseId: "",
    alertType: "LOW_STOCK" as "LOW_STOCK" | "OUT_OF_STOCK" | "OVERSTOCK",
    threshold: 10,
    message: "",
  });

  const { data: products = [] } = useProducts(organizationId);
  const { data: warehouses = [] } = useWarehouses(organizationId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.productId || formData.threshold < 0) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      // Simulation d&apos;appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Alerte créée avec succès");
      setFormData({
        productId: "",
        warehouseId: "",
        alertType: "LOW_STOCK",
        threshold: 10,
        message: "",
      });
    } catch {
      toast.error("Erreur lors de la création de l&apos;alerte");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Créer une alerte stock</h2>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Nouvelle alerte</span>
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
              <Label htmlFor="warehouseId">Entrepôt (optionnel)</Label>
              <Select
                value={formData.warehouseId}
                onValueChange={(value) =>
                  setFormData({ ...formData, warehouseId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les entrepôts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les entrepôts</SelectItem>
                  {warehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="alertType">Type d&apos;alerte *</Label>
              <Select
                value={formData.alertType}
                onValueChange={(
                  value: "LOW_STOCK" | "OUT_OF_STOCK" | "OVERSTOCK"
                ) => setFormData({ ...formData, alertType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW_STOCK">Stock bas</SelectItem>
                  <SelectItem value="OUT_OF_STOCK">Rupture de stock</SelectItem>
                  <SelectItem value="OVERSTOCK">Surstock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="threshold">Seuil d&apos;alerte *</Label>
              <Input
                id="threshold"
                type="number"
                min="0"
                value={formData.threshold}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    threshold: Number(e.target.value),
                  })
                }
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                {formData.alertType === "LOW_STOCK" &&
                  "Alerte quand le stock descend en dessous de cette valeur"}
                {formData.alertType === "OUT_OF_STOCK" &&
                  "Alerte quand le stock atteint zéro"}
                {formData.alertType === "OVERSTOCK" &&
                  "Alerte quand le stock dépasse cette valeur"}
              </p>
            </div>

            <div>
              <Label htmlFor="message">Message personnalisé</Label>
              <Input
                id="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Message d&apos;alerte personnalisé..."
              />
            </div>

            <Button type="submit" className="w-full">
              Créer l&apos;alerte
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
