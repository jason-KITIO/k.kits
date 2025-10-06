import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface SupplierDetailsHeaderProps {
  organizationId: string;
  supplierId: string;
  supplier: { name: string; active: boolean };
}

export function SupplierDetailsHeader({ organizationId, supplierId, supplier }: SupplierDetailsHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/preferences/organizations/${organizationId}/suppliers`}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{supplier.name}</h1>
          <Badge variant={supplier.active ? "default" : "secondary"}>
            {supplier.active ? "Actif" : "Inactif"}
          </Badge>
        </div>
        <p className="text-muted-foreground">Détails du fournisseur</p>
      </div>
      <Button asChild>
        <Link href={`/preferences/organizations/${organizationId}/suppliers/${supplierId}/edit`}>
          Modifier
        </Link>
      </Button>
    </div>
  );
}
