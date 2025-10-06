import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

interface StockTransfersHeaderProps {
  organizationId: string;
  storeId: string;
}

export function StockTransfersHeader({ organizationId, storeId }: StockTransfersHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/preferences/organizations/${organizationId}/stores/${storeId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Transferts de stock</h1>
          <p className="text-muted-foreground">Gérez les mouvements de stock entre entrepôts et boutiques</p>
        </div>
      </div>
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Nouveau transfert
      </Button>
    </div>
  );
}
