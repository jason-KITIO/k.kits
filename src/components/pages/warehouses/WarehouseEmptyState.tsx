import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";
import Link from "next/link";

interface WarehouseEmptyStateProps {
  organizationId: string;
  onCreateClick: () => void;
}

export function WarehouseEmptyState({ organizationId, onCreateClick }: WarehouseEmptyStateProps) {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Aucun entrepôt</h3>
        <p className="text-muted-foreground mb-4">
          Commencez par créer votre premier entrepôt
        </p>
        <div className="flex gap-2 justify-center">
          <Button onClick={onCreateClick}>
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
  );
}
