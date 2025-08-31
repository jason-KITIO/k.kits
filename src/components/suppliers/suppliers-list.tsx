"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSuppliers, useDeleteSupplier } from "@/hooks/use-purchases";
import { toast } from "sonner";
import { Truck, Mail, Phone, MapPin, User } from "lucide-react";

interface SuppliersListProps {
  organizationId: string;
}

export function SuppliersList({ organizationId }: SuppliersListProps) {
  const { data: suppliers = [], isLoading } = useSuppliers(organizationId);
  const deleteMutation = useDeleteSupplier(organizationId);

  const handleDelete = async (supplierId: string, name: string) => {
    if (confirm(`Supprimer le fournisseur "${name}" ?`)) {
      try {
        await deleteMutation.mutateAsync(supplierId);
        toast.success("Fournisseur supprimé");
      } catch {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  if (isLoading) return <div>Chargement des fournisseurs...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Liste des fournisseurs</h2>

      {suppliers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucun fournisseur trouvé</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.map((supplier) => (
            <Card key={supplier.id}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="h-5 w-5" />
                  <span>{supplier.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {supplier.email && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4" />
                    <span>{supplier.email}</span>
                  </div>
                )}
                {supplier.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4" />
                    <span>{supplier.phone}</span>
                  </div>
                )}
                {supplier.address && (
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{supplier.address}</span>
                  </div>
                )}
                {supplier.contactPerson && (
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4" />
                    <span>{supplier.contactPerson}</span>
                  </div>
                )}
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm">
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(supplier.id, supplier.name)}
                    disabled={deleteMutation.isPending}
                  >
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
