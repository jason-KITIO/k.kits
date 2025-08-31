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
import { useCreateTransfer } from "@/hooks/use-transfers";
import { useProducts } from "@/hooks/use-products";
import { useWarehouses } from "@/hooks/use-warehouses";
import { CreateTransferData } from "@/types/transfer";
import { toast } from "sonner";
import { ArrowRightLeft } from "lucide-react";

interface CreateTransferProps {
  organizationId: string;
}

export function CreateTransfer({ organizationId }: CreateTransferProps) {
  const [transferData, setTransferData] = useState({
    productId: "",
    quantity: 1,
    sourceType: "warehouse" as "warehouse" | "employee",
    destType: "warehouse" as "warehouse" | "employee",
    sourceWarehouseId: "",
    sourceUserId: "",
    destWarehouseId: "",
    destUserId: "",
    notes: "",
  });

  const { data: products = [] } = useProducts(organizationId);
  const { data: warehouses = [] } = useWarehouses(organizationId);
  const createMutation = useCreateTransfer(organizationId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: CreateTransferData = {
      productId: transferData.productId,
      quantity: transferData.quantity,
      notes: transferData.notes || undefined,
    };

    if (transferData.sourceType === "warehouse") {
      data.sourceWarehouseId = transferData.sourceWarehouseId;
    } else {
      data.sourceUserId = transferData.sourceUserId;
    }

    if (transferData.destType === "warehouse") {
      data.destWarehouseId = transferData.destWarehouseId;
    } else {
      data.destUserId = transferData.destUserId;
    }

    try {
      await createMutation.mutateAsync(data);
      toast.success("Transfert créé avec succès");
      setTransferData({
        productId: "",
        quantity: 1,
        sourceType: "warehouse",
        destType: "warehouse",
        sourceWarehouseId: "",
        sourceUserId: "",
        destWarehouseId: "",
        destUserId: "",
        notes: "",
      });
    } catch {
      toast.error("Erreur lors de la création du transfert");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Nouveau transfert</h2>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ArrowRightLeft className="h-5 w-5" />
            <span>Créer un transfert de stock</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="productId">Produit *</Label>
              <Select
                value={transferData.productId}
                onValueChange={(value) =>
                  setTransferData({ ...transferData, productId: value })
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
              <Label htmlFor="quantity">Quantité *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={transferData.quantity}
                onChange={(e) =>
                  setTransferData({
                    ...transferData,
                    quantity: Number(e.target.value),
                  })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Source</Label>
                <Select
                  value={transferData.sourceType}
                  onValueChange={(value: "warehouse" | "employee") =>
                    setTransferData({ ...transferData, sourceType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warehouse">Entrepôt</SelectItem>
                    <SelectItem value="employee">Employé</SelectItem>
                  </SelectContent>
                </Select>

                {transferData.sourceType === "warehouse" ? (
                  <Select
                    value={transferData.sourceWarehouseId}
                    onValueChange={(value) =>
                      setTransferData({
                        ...transferData,
                        sourceWarehouseId: value,
                      })
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
                ) : (
                  <Input
                    placeholder="ID de l'employé source"
                    value={transferData.sourceUserId}
                    onChange={(e) =>
                      setTransferData({
                        ...transferData,
                        sourceUserId: e.target.value,
                      })
                    }
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label>Destination</Label>
                <Select
                  value={transferData.destType}
                  onValueChange={(value: "warehouse" | "employee") =>
                    setTransferData({ ...transferData, destType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warehouse">Entrepôt</SelectItem>
                    <SelectItem value="employee">Employé</SelectItem>
                  </SelectContent>
                </Select>

                {transferData.destType === "warehouse" ? (
                  <Select
                    value={transferData.destWarehouseId}
                    onValueChange={(value) =>
                      setTransferData({
                        ...transferData,
                        destWarehouseId: value,
                      })
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
                ) : (
                  <Input
                    placeholder="ID de l'employé destination"
                    value={transferData.destUserId}
                    onChange={(e) =>
                      setTransferData({
                        ...transferData,
                        destUserId: e.target.value,
                      })
                    }
                  />
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={transferData.notes}
                onChange={(e) =>
                  setTransferData({ ...transferData, notes: e.target.value })
                }
                placeholder="Commentaires sur le transfert..."
              />
            </div>

            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full"
            >
              {createMutation.isPending ? "Création..." : "Créer le transfert"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
