"use client";

import { useParams } from "next/navigation";
import { useWarehouses, useDeleteWarehouse } from "@/hooks/use-warehouses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Phone, User, Package, Trash2, Edit } from "lucide-react";
import { CreateWarehouseDialog } from "@/components/warehouses/create-warehouse-dialog";
import { useState } from "react";
import Link from "next/link";

export default function WarehousesPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data: warehouses, isLoading } = useWarehouses(organizationId);
  const deleteWarehouse = useDeleteWarehouse(organizationId);

  const handleDelete = async (warehouseId: string, warehouseName: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'entrepôt "${warehouseName}" ?`)) {
      try {
        await deleteWarehouse.mutateAsync(warehouseId);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const getTypeLabel = (type: string) => {
    const types = {
      MAIN: "Principal",
      SECONDARY: "Secondaire", 
      TRANSIT: "Transit",
      RETURNS: "Retours"
    };
    return types[type as keyof typeof types] || type;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      MAIN: "bg-blue-100 text-blue-800",
      SECONDARY: "bg-green-100 text-green-800",
      TRANSIT: "bg-yellow-100 text-yellow-800", 
      RETURNS: "bg-red-100 text-red-800"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Entrepôts</h1>
          <p className="text-muted-foreground">
            Gérez vos entrepôts et centres de stockage
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel entrepôt
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/preferences/organizations/${organizationId}/warehouses/new`}>
              <Plus className="h-4 w-4 mr-2" />
              Créer (page)
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {warehouses?.map((warehouse) => (
          <Card key={warehouse.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                  <Badge className={`mt-2 ${getTypeColor(warehouse.type)}`}>
                    {getTypeLabel(warehouse.type)}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <Link href={`/preferences/organizations/${organizationId}/warehouses/${warehouse.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(warehouse.id, warehouse.name)}
                    disabled={deleteWarehouse.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {warehouse.address && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  {warehouse.address}
                </div>
              )}
              {warehouse.phone && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2" />
                  {warehouse.phone}
                </div>
              )}
              {warehouse.manager && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="h-4 w-4 mr-2" />
                  {warehouse.manager.firstName} {warehouse.manager.lastName}
                </div>
              )}
              {warehouse.capacity && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Package className="h-4 w-4 mr-2" />
                  Capacité: {warehouse.capacity}
                </div>
              )}
              <div className="pt-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  asChild
                >
                  <Link href={`/preferences/organizations/${organizationId}/warehouses/${warehouse.id}`}>
                    Voir les détails
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {warehouses?.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun entrepôt</h3>
            <p className="text-muted-foreground mb-4">
              Commencez par créer votre premier entrepôt
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer un entrepôt
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/preferences/organizations/${organizationId}/warehouses/new`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer (page)
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <CreateWarehouseDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        organizationId={organizationId}
      />
    </div>
  );
}