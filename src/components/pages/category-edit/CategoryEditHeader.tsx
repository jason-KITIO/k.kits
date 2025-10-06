import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CategoryEditHeaderProps {
  organizationId: string;
}

export function CategoryEditHeader({ organizationId }: CategoryEditHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/preferences/organizations/${organizationId}/categories`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Link>
      </Button>
      <div>
        <h1 className="text-2xl font-bold">Modifier la catégorie</h1>
        <p className="text-muted-foreground">Modifiez les informations de la catégorie</p>
      </div>
    </div>
  );
}
