"use client";

import { useParams } from "next/navigation";
import { useStores } from "@/hooks/useStore";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Store, MapPin, Phone, User, ArrowRight } from "lucide-react";
import { Store as StoreType } from "@/services/storeService";
import Link from "next/link";

import { PageProtection } from "@/components/page-protection";
import { PERMISSIONS } from "@/lib/permissions";

const storeTypeConfig = {
  PHYSICAL: { label: "Physique", color: "bg-blue-100 text-blue-800" },
  ONLINE: { label: "En ligne", color: "bg-green-100 text-green-800" },
  HYBRID: { label: "Hybride", color: "bg-purple-100 text-purple-800" },
};

function StoreCard({
  store,
  organizationId,
}: {
  store: StoreType;
  organizationId: string;
}) {
  const typeConfig = storeTypeConfig[store.type];

  return (
    <Card className="hover:shadow-md transition-all cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-blue-600" />
            {store.name}
          </CardTitle>
          <Badge className={typeConfig.color}>{typeConfig.label}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {store.address && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {store.address}
          </div>
        )}

        {store.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            {store.phone}
          </div>
        )}

        {store.manager && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            {store.manager.firstName} {store.manager.lastName}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-muted-foreground">
            Créée le {new Date(store.createdAt).toLocaleDateString()}
          </div>

          <Button
            asChild
            size="sm"
            className="group-hover:bg-primary group-hover:text-primary-foreground"
          >
            <Link
              href={`/preferences/organizations/${organizationId}/stores/${store.id}`}
            >
              Gérer
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StoresPage() {
  const params = useParams();
  const organizationId = params.id as string;

  const { data: stores, isLoading, error } = useStores(organizationId);

  if (isLoading) return <PageLoader text="Chargement des boutiques..." />;
  if (error) return <div>Erreur: {error.message}</div>;

  const activeStores = stores?.filter((s) => s.active).length || 0;
  const physicalStores =
    stores?.filter((s) => s.type === "PHYSICAL").length || 0;
  const onlineStores = stores?.filter((s) => s.type === "ONLINE").length || 0;

  return (
    <PageProtection
      requiredPermission={PERMISSIONS.ORG_SETTINGS}
      organizationId={organizationId}
      fallbackUrl={`/preferences/organizations/${organizationId}/dashboard`}
    >
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Boutiques</h1>
            <p className="text-muted-foreground">
              Gérez vos points de vente et leurs opérations
            </p>
          </div>
          <Button asChild>
            <Link
              href={`/preferences/organizations/${organizationId}/stores/new`}
            >
              <Store className="h-4 w-4 mr-2" />
              Nouvelle boutique
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total boutiques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stores?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Points de vente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Actives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {activeStores}
              </div>
              <p className="text-xs text-muted-foreground">En fonctionnement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Physiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {physicalStores}
              </div>
              <p className="text-xs text-muted-foreground">
                Magasins physiques
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">En ligne</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {onlineStores}
              </div>
              <p className="text-xs text-muted-foreground">
                Boutiques digitales
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stores && stores.length > 0 ? (
            stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                organizationId={organizationId}
              />
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Store className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucune boutique</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Créez votre première boutique pour commencer à vendre.
                </p>
                <Button asChild>
                  <Link
                    href={`/preferences/organizations/${organizationId}/stores/new`}
                  >
                    <Store className="h-4 w-4 mr-2" />
                    Créer une boutique
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageProtection>
  );
}
