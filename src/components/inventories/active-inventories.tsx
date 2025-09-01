"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  useInventories,
  useUpdateInventory,
  useDeleteInventory,
} from "@/hooks/use-inventories";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { StockInventory } from "@prisma/client";
import { toast } from "sonner";

interface ActiveInventoriesProps {
  organizationId: string;
}

export function ActiveInventories({ organizationId }: ActiveInventoriesProps) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<StockInventory | null>(null);
  const [updateData, setUpdateData] = useState({
    actualQty: 0,
    notes: "",
  });

  const { data: inventories = [], isLoading } = useInventories(organizationId);
  const updateMutation = useUpdateInventory(organizationId);
  const deleteMutation = useDeleteInventory(organizationId);

  const activeInventories = inventories.filter(
    (inv) => inv.status === "PENDING"
  );

  const handleUpdate = (inventory: unknown) => {
    setSelectedInventory(inventory as StockInventory);
    // setUpdateData({
    //   actualQty: inventory.expectedQty,
    //   notes: inventory.notes || "",
    // });
    setIsUpdateModalOpen(true);
  };

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInventory) return;

    try {
      await updateMutation.mutateAsync({
        id: selectedInventory.id,
        data: updateData,
      });
      toast.success("Inventaire mis à jour");
      setIsUpdateModalOpen(false);} catch {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleDelete = async (inventoryId: string) => {
    if (confirm("Supprimer cet inventaire ?")) {
      try {
        await deleteMutation.mutateAsync(inventoryId);
        toast.success("Inventaire supprimé");} catch {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: { variant: "secondary" as const, icon: Clock, text: "En cours" },
      COMPLETED: {
        variant: "default" as const,
        icon: CheckCircle,
        text: "Terminé",
      },
      CANCELLED: {
        variant: "destructive" as const,
        icon: XCircle,
        text: "Annulé",
      },
    };

    const config =
      variants[status as keyof typeof variants] || variants.PENDING;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
        <span>{config.text}</span>
      </Badge>
    );
  };

  const getDifferenceBadge = (difference: number) => {
    if (difference > 0) {
      return (
        <Badge variant="default" className="flex items-center space-x-1">
          <TrendingUp className="h-3 w-3" />
          <span>+{difference}</span>
        </Badge>
      );
    } else if (difference < 0) {
      return (
        <Badge variant="destructive" className="flex items-center space-x-1">
          <TrendingDown className="h-3 w-3" />
          <span>{difference}</span>
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <span>0</span>
      </Badge>
    );
  };

  if (isLoading) return <div>Chargement des inventaires...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Inventaires actifs</h2>

      {activeInventories.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucun inventaire actif</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeInventories.map((inventory) => (
            <Card key={inventory.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-sm">{inventory.product?.name}</span>
                  {getStatusBadge(inventory.status)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">SKU:</span>{" "}
                    {inventory.product?.sku}
                  </div>
                  <div>
                    <span className="font-medium">Attendu:</span>{" "}
                    {inventory.expectedQty}
                  </div>
                  <div>
                    <span className="font-medium">Réel:</span>{" "}
                    {inventory.actualQty}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Écart:</span>
                    {getDifferenceBadge(inventory.difference)}
                  </div>
                </div>
                {inventory.warehouse && (
                  <div className="text-sm">
                    <span className="font-medium">Entrepôt:</span>{" "}
                    {inventory.warehouse.name}
                  </div>
                )}
                <div className="text-sm">
                  <span className="font-medium">Planifié:</span>{" "}
                  {new Date(inventory.scheduledDate).toLocaleDateString()}
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdate(inventory)}
                  >
                    Compter
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(inventory.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Compter - {selectedInventory?.productId}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitUpdate} className="space-y-4">
            <div>
              <Label>Quantité attendue: {selectedInventory?.expectedQty}</Label>
            </div>
            <div>
              <Label htmlFor="actualQty">Quantité réelle *</Label>
              <Input
                id="actualQty"
                type="number"
                value={updateData.actualQty}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    actualQty: Number(e.target.value),
                  })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={updateData.notes}
                onChange={(e) =>
                  setUpdateData({ ...updateData, notes: e.target.value })
                }
                placeholder="Commentaires sur l'inventaire..."
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUpdateModalOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Mise à jour..." : "Valider"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
