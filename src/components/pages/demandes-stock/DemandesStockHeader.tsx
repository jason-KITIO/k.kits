import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface DemandesStockHeaderProps {
  organizationId: string;
  storeId: string;
}

export function DemandesStockHeader({ organizationId, storeId }: DemandesStockHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/preferences/organizations/${organizationId}/stores/${storeId}`}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <div>
        <h1 className="text-3xl font-bold">Déplacer des Articles</h1>
        <p className="text-muted-foreground">Demandez à déplacer des marchandises d'un endroit à un autre</p>
      </div>
    </div>
  );
}
