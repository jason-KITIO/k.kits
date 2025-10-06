"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Store, MapPin, Phone, User, MoreHorizontal, Edit, Copy, Trash2, ArrowRight } from "lucide-react";
import { useDeleteStore } from "@/hooks/use-stores";
import { Store as StoreType } from "@/types/store";

const storeTypeConfig = {
  PHYSICAL: { label: "Physique", color: "bg-blue-100 text-blue-800" },
  ONLINE: { label: "En ligne", color: "bg-green-100 text-green-800" },
  HYBRID: { label: "Hybride", color: "bg-purple-100 text-purple-800" },
};

export function StoreCard({ store, organizationId }: { store: StoreType; organizationId: string }) {
  const typeConfig = storeTypeConfig[store.type as keyof typeof storeTypeConfig];
  const [isDeleting, setIsDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const deleteStore = useDeleteStore();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteStore.mutateAsync({ organizationId, storeId: store.id });
      setDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
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
                  <DropdownMenuItem asChild>
                    <Link href={`/preferences/organizations/${organizationId}/stores/${store.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />Modifier
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/preferences/organizations/${organizationId}/stores/new?duplicate=${store.id}`}>
                      <Copy className="h-4 w-4 mr-2" />Dupliquer
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setDialogOpen(true)} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {store.address && <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{store.address}</div>}
          {store.phone && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4" />{store.phone}</div>}
          {store.manager && <div className="flex items-center gap-2 text-sm text-muted-foreground"><User className="h-4 w-4" />{store.manager.firstName} {store.manager.lastName}</div>}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-muted-foreground">Créée le {new Date(store.createdAt).toLocaleDateString()}</div>
            <Button asChild size="sm">
              <Link href={`/preferences/organizations/${organizationId}/stores/${store.id}`}>
                Gérer<ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer la boutique</DialogTitle>
            <DialogDescription>Êtes-vous sûr de vouloir supprimer la boutique "{store.name}" ? Cette action est irréversible.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
