import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";
import Link from "next/link";

interface StoresPageHeaderProps {
  organizationId: string;
}

export function StoresPageHeader({ organizationId }: StoresPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Boutiques</h1>
        <p className="text-muted-foreground">Gérez vos points de vente et leurs opérations</p>
      </div>
      <Button asChild>
        <Link href={`/preferences/organizations/${organizationId}/stores/new`}>
          <Store className="h-4 w-4 mr-2" />
          Nouvelle boutique
        </Link>
      </Button>
    </div>
  );
}
