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
import {
  useCreateInventory,
  useScheduledInventories,
} from "@/hooks/use-inventories";
import { useProducts } from "@/hooks/use-products";
import { useWarehouses } from "@/hooks/use-warehouses";
import { CreateInventoryData } from "@/types/inventory";
import { toast } from "sonner";
import { Calendar, Plus } from "lucide-react";

interface ScheduleInventoryProps {
  organizationId: string;
}

export function ScheduleInventory({ organizationId }: ScheduleInventoryProps) {
  const [inventoryData, setInventoryData] = useState({
    productId: "",
    warehouseId: "",
    expectedQty: 0,
    scheduledDate: "",
    notes: "",
  });

  const { data: products = [] } = useProducts(organizationId);
  const { data: warehouses = [] } = useWarehouses(organizationId);
  const { data: scheduled = [] } = useScheduledInventories(organizationId);
  const createMutation = useCreateInventory(organizationId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: CreateInventoryData = {
      productId: inventoryData.productId,
      expectedQty: inventoryData.expectedQty,
      scheduledDate: inventoryData.scheduledDate,
      notes: inventoryData.notes || undefined,
    };

    if (inventoryData.warehouseId) {
      data.warehouseId = inventoryData.warehouseId;
    }

    try {
      await createMutation.mutateAsync(data);
      toast.success("Inventaire planifié avec succès");
      setInventoryData({
        productId: "",
        warehouseId: "",
        expectedQty: 0,
        scheduledDate: "",
        notes: "",
      });
    } catch {
      toast.error("Erreur lors de la planification");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Planifier un inventaire</h2>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Nouvel inventaire</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="productId">Produit *</Label>
              <Select
                value={inventoryData.productId}
                onValueChange={(value) =>
                  setInventoryData({ ...inventoryData, productId: value })
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
              <Label htmlFor="warehouseId">Entrepôt</Label>
              <Select
                value={inventoryData.warehouseId || "none"}
                onValueChange={(value) =>
                  setInventoryData({
                    ...inventoryData,
                    warehouseId: value === "none" ? "" : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un entrepôt (optionnel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    Aucun entrepôt spécifique
                  </SelectItem>
                  {warehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="expectedQty">Quantité attendue *</Label>
              <Input
                id="expectedQty"
                type="number"
                min="0"
                value={inventoryData.expectedQty}
                onChange={(e) =>
                  setInventoryData({
                    ...inventoryData,
                    expectedQty: Number(e.target.value),
                  })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="scheduledDate">Date planifiée *</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={inventoryData.scheduledDate}
                onChange={(e) =>
                  setInventoryData({
                    ...inventoryData,
                    scheduledDate: e.target.value,
                  })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={inventoryData.notes}
                onChange={(e) =>
                  setInventoryData({ ...inventoryData, notes: e.target.value })
                }
                placeholder="Instructions ou commentaires..."
              />
            </div>

            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full"
            >
              {createMutation.isPending
                ? "Planification..."
                : "Planifier l'inventaire"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-4">Inventaires planifiés</h3>
        {scheduled.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun inventaire planifié</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {scheduled.map((inventory) => (
              <Card key={inventory.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">
                        {inventory.product?.name}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({inventory.product?.sku})
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(inventory.scheduledDate).toLocaleDateString()}
                    </div>
                  </div>
                  {inventory.warehouse && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Entrepôt: {inventory.warehouse.name}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
