import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface StoreFormHeaderProps {
  organizationId: string;
  isDuplicate: boolean;
}

export function StoreFormHeader({ organizationId, isDuplicate }: StoreFormHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/preferences/organizations/${organizationId}/stores`}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <div>
        <h1 className="text-3xl font-bold">
          {isDuplicate ? "Dupliquer la boutique" : "Nouvelle boutique"}
        </h1>
        <p className="text-muted-foreground">
          {isDuplicate ? "Créer une copie de la boutique" : "Créez un nouveau point de vente"}
        </p>
      </div>
    </div>
  );
}
