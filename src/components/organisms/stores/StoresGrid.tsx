import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store as StoreIcon } from "lucide-react";
import Link from "next/link";
import { StoreCard } from "@/components/molecules/stores/StoreCard";
import { Store as StoreType } from "@/types/store";

export function StoresGrid({ stores, organizationId }: { stores: StoreType[]; organizationId: string }) {
  if (stores.length === 0) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <StoreIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucune boutique</h3>
          <p className="text-muted-foreground text-center mb-4">
            Créez votre première boutique pour commencer à vendre.
          </p>
          <Button asChild>
            <Link href={`/preferences/organizations/${organizationId}/stores/new`}>
              <StoreIcon className="h-4 w-4 mr-2" />
              Créer une boutique
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {stores.map(store => (
        <StoreCard key={store.id} store={store} organizationId={organizationId} />
      ))}
    </div>
  );
}
