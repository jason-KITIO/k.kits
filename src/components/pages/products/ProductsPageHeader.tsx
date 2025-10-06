import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface ProductsPageHeaderProps {
  organizationId: string;
}

export function ProductsPageHeader({ organizationId }: ProductsPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Produits</h1>
        <p className="text-muted-foreground">Gérez le catalogue de produits de votre organisation</p>
      </div>
      <Button asChild>
        <Link href={`/preferences/organizations/${organizationId}/products/new`}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau produit
        </Link>
      </Button>
    </div>
  );
}
