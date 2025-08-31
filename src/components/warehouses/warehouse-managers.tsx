"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWarehouses } from "@/hooks/use-warehouses";
import { User, Building2, Mail } from "lucide-react";

interface WarehouseManagersProps {
  organizationId: string;
}

export function WarehouseManagers({ organizationId }: WarehouseManagersProps) {
  const { data: warehouses = [], isLoading } = useWarehouses(organizationId);

  const managersData = warehouses
    .filter(w => w.manager)
    .map(w => ({
      warehouse: w,
      manager: w.manager!
    }));

  if (isLoading) return <div>Chargement des gestionnaires...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Gestionnaires d&apos;entrepôts</h2>

      {managersData.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Aucun gestionnaire assigné aux entrepôts</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {managersData.map(({ warehouse, manager }) => (
            <Card key={warehouse.id}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>{manager.firstName} {manager.lastName}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Building2 className="h-4 w-4" />
                  <span>{warehouse.name}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4" />
                  <span>{manager.email}</span>
                </div>
                {warehouse.address && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Adresse:</span> {warehouse.address}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}