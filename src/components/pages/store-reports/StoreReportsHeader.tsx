import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface StoreReportsHeaderProps {
  organizationId: string;
  storeId: string;
}

export function StoreReportsHeader({ organizationId, storeId }: StoreReportsHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/preferences/organizations/${organizationId}/stores/${storeId}`}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <div>
        <h1 className="text-3xl font-bold">Rapports de la boutique</h1>
        <p className="text-muted-foreground">Analysez les performances de votre boutique</p>
      </div>
    </div>
  );
}
