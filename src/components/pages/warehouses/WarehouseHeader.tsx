import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface WarehouseHeaderProps {
  organizationId: string;
  onCreateClick: () => void;
}

export function WarehouseHeader({ organizationId, onCreateClick }: WarehouseHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Entrepôts</h1>
        <p className="text-muted-foreground">
          Gérez vos entrepôts et centres de stockage
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={onCreateClick}>
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
  );
}
