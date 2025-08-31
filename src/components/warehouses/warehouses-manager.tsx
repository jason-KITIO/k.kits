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
import {
  useWarehouses,
  useCreateWarehouse,
  useUpdateWarehouse,
  useDeleteWarehouse,
} from "@/hooks/use-warehouses";
import { toast } from "sonner";
import { Building2, MapPin, User } from "lucide-react";

interface WarehousesManagerProps {
  organizationId: string;
}

export function WarehousesManager({ organizationId }: WarehousesManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<
    Warehouse | undefined
  >();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    managerId: "",
  });

  const { data: warehouses = [], isLoading } = useWarehouses(organizationId);
  const createMutation = useCreateWarehouse(organizationId);
  const updateMutation = useUpdateWarehouse(organizationId);
  const deleteMutation = useDeleteWarehouse(organizationId);

  const handleCreate = () => {
    setSelectedWarehouse(undefined);
    setFormData({ name: "", description: "", address: "", managerId: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setFormData({
      name: warehouse.name,
      description: warehouse.description || "",
      address: warehouse.address || "",
      managerId: warehouse.managerId || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedWarehouse) {
        await updateMutation.mutateAsync({
          id: selectedWarehouse.id,
          data: formData,
        });
        toast.success("Entrepôt modifié avec succès");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Entrepôt créé avec succès");
      }
      setIsModalOpen(false);
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const handleDelete = async (warehouse: Warehouse) => {
    if (confirm(`Supprimer l'entrepôt "${warehouse.name}" ?`)) {
      try {
        await deleteMutation.mutateAsync(warehouse.id);
        toast.success("Entrepôt supprimé avec succès");
      } catch {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  if (isLoading) return <div>Chargement des entrepôts...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mes entrepôts</h2>
        <Button onClick={handleCreate}>Nouvel entrepôt</Button>
      </div>

      {warehouses.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Aucun entrepôt trouvé</p>
            <Button onClick={handleCreate}>Créer votre premier entrepôt</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {warehouses.map((warehouse) => (
            <Card key={warehouse.id}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>{warehouse.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {warehouse.description && (
                  <p className="text-sm text-muted-foreground">
                    {warehouse.description}
                  </p>
                )}
                {warehouse.address && (
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{warehouse.address}</span>
                  </div>
                )}
                {warehouse.manager && (
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4" />
                    <span>
                      {warehouse.manager.firstName} {warehouse.manager.lastName}
                    </span>
                  </div>
                )}
                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(warehouse)}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(warehouse)}
                  >
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedWarehouse ? "Modifier l'entrepôt" : "Nouvel entrepôt"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {selectedWarehouse ? "Modifier" : "Créer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
