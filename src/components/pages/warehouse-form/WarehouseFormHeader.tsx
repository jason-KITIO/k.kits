import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface WarehouseFormHeaderProps {
  organizationId: string;
}

export function WarehouseFormHeader({ organizationId }: WarehouseFormHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/preferences/organizations/${organizationId}/warehouses`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Link>
      </Button>
      <div>
        <h1 className="text-2xl font-bold">Nouvel entrepôt</h1>
        <p className="text-muted-foreground">Créer un nouveau centre de stockage</p>
      </div>
    </div>
  );
}
