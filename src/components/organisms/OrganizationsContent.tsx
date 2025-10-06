"use client";

import { useOrganizations, useDeleteOrganization } from "@/hooks/use-organizations";
import { useViewMode, useDeleteDialog } from "@/hooks/shared";
import { OrganizationsHeader } from "./OrganizationsHeader";
import { OrganizationsGrid } from "./OrganizationsGrid";
import { OrganizationsTable } from "./OrganizationsTable";
import { OrganizationsLoading } from "./OrganizationsLoading";
import { EmptyState } from "@/components/molecules";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function OrganizationsContent() {
  const router = useRouter();
  const { data, error, isLoading } = useOrganizations();
  const { viewMode, setViewMode } = useViewMode();
  const { dialog, openDialog, closeDialog } = useDeleteDialog();
  const deleteOrganization = useDeleteOrganization();

  const handleEdit = (orgId: string) => router.push(`/preferences/organizations/${orgId}/edit`);
  
  const handleDuplicate = (org: any) => {
    const duplicatedData = {
      name: `${org.name} (Copie)`,
      description: org.description,
      domain: `${org.domain?.split('.')[0]}-copie`,
      logo: org.logo,
      address: org.address,
      phone: org.phone,
      email: org.email,
      active: true,
    };
    router.push(`/preferences/organizations/create?duplicate=${encodeURIComponent(JSON.stringify(duplicatedData))}`);
  };

  const confirmDelete = () => {
    if (dialog.item && typeof dialog.item === 'object' && dialog.item !== null && 'id' in dialog.item) {
      deleteOrganization.mutate((dialog.item as { id: string }).id);
      closeDialog();
    }
  };

  if (isLoading) return <OrganizationsLoading />;
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <p className="font-medium">Erreur de chargement</p>
              <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="Aucune organisation"
        description="Créez votre première organisation pour commencer"
        actionLabel="Créer une organisation"
        actionHref="/preferences/organizations/create"
      />
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <OrganizationsHeader count={data.length} viewMode={viewMode} onViewModeChange={setViewMode} />
        
        {viewMode === "cards" ? (
          <OrganizationsGrid
            organizations={data}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onDelete={openDialog}
          />
        ) : (
          <OrganizationsTable
            organizations={data}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onDelete={openDialog}
          />
        )}
      </div>

      <AlertDialog open={dialog.open} onOpenChange={(open) => !open && closeDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'organisation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'organisation "{(dialog.item as { name?: string })?.name}" ?
              Cette action est irréversible et supprimera toutes les données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
