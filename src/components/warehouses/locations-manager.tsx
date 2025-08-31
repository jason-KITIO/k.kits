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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useWarehouses,
  useLocations,
  useCreateLocation,
  useUpdateLocation,
  useDeleteLocation,
} from "@/hooks/use-warehouses";
import { toast } from "sonner";
import { MapPin } from "lucide-react";

interface LocationsManagerProps {
  organizationId: string;
}

export function LocationsManager({ organizationId }: LocationsManagerProps) {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<
    StockLocation | undefined
  >();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    zone: "",
    aisle: "",
    shelf: "",
    bin: "",
  });

  const { data: warehouses = [] } = useWarehouses(organizationId);
  const { data: locations = [], isLoading } = useLocations(
    organizationId,
    selectedWarehouseId
  );
  const createMutation = useCreateLocation(organizationId, selectedWarehouseId);
  const updateMutation = useUpdateLocation(organizationId, selectedWarehouseId);
  const deleteMutation = useDeleteLocation(organizationId, selectedWarehouseId);

  const handleCreate = () => {
    if (!selectedWarehouseId) {
      toast.error("Sélectionnez d'abord un entrepôt");
      return;
    }
    setSelectedLocation(undefined);
    setFormData({
      name: "",
      description: "",
      zone: "",
      aisle: "",
      shelf: "",
      bin: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (location: StockLocation) => {
    setSelectedLocation(location);
    setFormData({
      name: location.name,
      description: location.description || "",
      zone: location.zone || "",
      aisle: location.aisle || "",
      shelf: location.shelf || "",
      bin: location.bin || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedLocation) {
        await updateMutation.mutateAsync({
          id: selectedLocation.id,
          data: formData,
        });
        toast.success("Emplacement modifié avec succès");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Emplacement créé avec succès");
      }
      setIsModalOpen(false);
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const handleDelete = async (location: StockLocation) => {
    if (confirm(`Supprimer l'emplacement "${location.name}" ?`)) {
      try {
        await deleteMutation.mutateAsync(location.id);
        toast.success("Emplacement supprimé avec succès");
      } catch {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Emplacements</h2>
        <div className="flex space-x-2">
          <Select
            value={selectedWarehouseId}
            onValueChange={setSelectedWarehouseId}
          >
            <SelectTrigger className="w-64">
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
          <Button onClick={handleCreate} disabled={!selectedWarehouseId}>
            Nouvel emplacement
          </Button>
        </div>
      </div>

      {!selectedWarehouseId ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              Sélectionnez un entrepôt pour voir ses emplacements
            </p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div>Chargement des emplacements...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((location) => (
            <Card key={location.id}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>{location.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {location.description && (
                  <p className="text-sm text-muted-foreground">
                    {location.description}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {location.zone && (
                    <div>
                      <span className="font-medium">Zone:</span> {location.zone}
                    </div>
                  )}
                  {location.aisle && (
                    <div>
                      <span className="font-medium">Allée:</span>{" "}
                      {location.aisle}
                    </div>
                  )}
                  {location.shelf && (
                    <div>
                      <span className="font-medium">Étagère:</span>{" "}
                      {location.shelf}
                    </div>
                  )}
                  {location.bin && (
                    <div>
                      <span className="font-medium">Casier:</span>{" "}
                      {location.bin}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(location)}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(location)}
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
              {selectedLocation
                ? "Modifier l'emplacement"
                : "Nouvel emplacement"}
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zone">Zone</Label>
                <Input
                  id="zone"
                  value={formData.zone}
                  onChange={(e) =>
                    setFormData({ ...formData, zone: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="aisle">Allée</Label>
                <Input
                  id="aisle"
                  value={formData.aisle}
                  onChange={(e) =>
                    setFormData({ ...formData, aisle: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shelf">Étagère</Label>
                <Input
                  id="shelf"
                  value={formData.shelf}
                  onChange={(e) =>
                    setFormData({ ...formData, shelf: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="bin">Casier</Label>
                <Input
                  id="bin"
                  value={formData.bin}
                  onChange={(e) =>
                    setFormData({ ...formData, bin: e.target.value })
                  }
                />
              </div>
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
                {selectedLocation ? "Modifier" : "Créer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
