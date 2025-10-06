import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface SaleDetailsHeaderProps {
  organizationId: string;
  storeId: string;
  saleId: string;
}

export function SaleDetailsHeader({ organizationId, storeId, saleId }: SaleDetailsHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/preferences/organizations/${organizationId}/stores/${storeId}/sales`}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <div>
        <h1 className="text-3xl font-bold">Détails de la vente</h1>
        <p className="text-muted-foreground">Vente #{saleId.slice(-8)}</p>
      </div>
    </div>
  );
}
