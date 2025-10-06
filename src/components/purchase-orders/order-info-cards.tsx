"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface OrderInfoCardsProps {
  supplier: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  warehouse: {
    name: string;
    address?: string;
  };
  expectedDate?: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

export function OrderInfoCards({ supplier, warehouse, expectedDate, user }: OrderInfoCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-card border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            Fournisseur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="font-medium text-foreground">{supplier.name}</p>
            {supplier.email && (
              <p className="text-sm text-muted-foreground">{supplier.email}</p>
            )}
            {supplier.phone && (
              <p className="text-sm text-muted-foreground">{supplier.phone}</p>
            )}
            {supplier.address && (
              <p className="text-sm text-muted-foreground">{supplier.address}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            Entrepôt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="font-medium text-foreground">{warehouse.name}</p>
            {warehouse.address && (
              <p className="text-sm text-muted-foreground">{warehouse.address}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            Livraison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="font-medium text-foreground">
              {expectedDate && !isNaN(new Date(expectedDate).getTime())
                ? format(new Date(expectedDate), "PPP", { locale: fr })
                : "Non définie"}
            </p>
            <p className="text-sm text-muted-foreground">
              Commandé par {user.firstName} {user.lastName}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}