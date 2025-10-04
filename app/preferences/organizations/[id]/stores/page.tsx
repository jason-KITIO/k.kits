"use client";

import { useParams } from "next/navigation";
import { useStores } from "@/hooks/useStore";
import { useDeleteStore } from "@/hooks/use-stores";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Store, MapPin, Phone, User, ArrowRight, MoreHorizontal, Edit, Copy, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Store as StoreType } from "@/types/store";
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
  const typeConfig =
    storeTypeConfig[store.type as keyof typeof storeTypeConfig];
  const [isDeleting, setIsDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const deleteStore = useDeleteStore(organizationId);

  const handleEdit = () => {
    window.location.href = `/preferences/organizations/${organizationId}/stores/${store.id}/edit`;
  };

  const handleDuplicate = () => {
    window.location.href = `/preferences/organizations/${organizationId}/stores/new?duplicate=${store.id}`;
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteStore.mutateAsync(store.id);
      setDialogOpen(false);
    } catch (error) {
      // Le toast d'erreur est géré par le hook
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-all group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-blue-600" />
            {store.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={typeConfig.color}>{typeConfig.label}</Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="h-4 w-4" />
                  Dupliquer
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
                      <Trash2 className="h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Supprimer la boutique</DialogTitle>
                      <DialogDescription>
                        Êtes-vous sûr de vouloir supprimer la boutique "{store.name}" ?
                        Cette action est irréversible.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
                      <Button 
                        variant="destructive" 
                        onClick={handleDelete}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Suppression..." : "Supprimer"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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

          <Button asChild size="sm">
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

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-[150px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
          <Skeleton className="h-10 w-[140px]" />
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-[100px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-2" />
                <Skeleton className="h-3 w-[120px]" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-5 w-[120px]" />
                  </div>
                  <Skeleton className="h-6 w-[60px]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-3 w-[80px]" />
                    <Skeleton className="h-8 w-[80px]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
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
