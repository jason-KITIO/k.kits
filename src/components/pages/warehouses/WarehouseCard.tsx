import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, User, Package, Edit, Copy, Trash2, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Warehouse {
  id: string;
  name: string;
  type: string;
  address?: string;
  phone?: string;
  capacity?: number;
  manager?: { firstName?: string; lastName?: string };
}

interface WarehouseCardProps {
  warehouse: Warehouse;
  organizationId: string;
  onDelete: (id: string, name: string) => void;
}

const TYPE_LABELS = {
  MAIN: "Principal",
  SECONDARY: "Secondaire",
  TRANSIT: "Transit",
  RETURNS: "Retours"
};

const TYPE_COLORS = {
  MAIN: "bg-blue-100 text-blue-800",
  SECONDARY: "bg-green-100 text-green-800",
  TRANSIT: "bg-yellow-100 text-yellow-800",
  RETURNS: "bg-red-100 text-red-800"
};

export function WarehouseCard({ warehouse, organizationId, onDelete }: WarehouseCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{warehouse.name}</CardTitle>
            <Badge className={`mt-2 ${TYPE_COLORS[warehouse.type as keyof typeof TYPE_COLORS] || "bg-gray-100 text-gray-800"}`}>
              {TYPE_LABELS[warehouse.type as keyof typeof TYPE_LABELS] || warehouse.type}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/preferences/organizations/${organizationId}/warehouses/${warehouse.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/preferences/organizations/${organizationId}/warehouses/new?duplicate=${warehouse.id}`}>
                  <Copy className="h-4 w-4 mr-2" />
                  Dupliquer
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(warehouse.id, warehouse.name)} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/preferences/organizations/${organizationId}/warehouses/${warehouse.id}`}>
              Voir les détails
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
