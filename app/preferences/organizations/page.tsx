"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOrganizations } from "@/hooks/use-organizations";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building2,
  Plus,
  Users,
  ArrowRight,
  Loader2,
  Grid3X3,
  List,
  Calendar,
  MapPin,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useUpdateOrganization, useDeleteOrganization } from "@/hooks/use-organizations";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrganizationsPage() {
  const router = useRouter();
  const { data, error, isLoading } = useOrganizations();
  const deleteOrganization = useDeleteOrganization();
  const [hasChecked, setHasChecked] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; org: any | null }>({ open: false, org: null });

  const handleEdit = (orgId: string) => {
    router.push(`/preferences/organizations/${orgId}/edit`);
  };

  const handleDelete = (org: any) => {
    setDeleteDialog({ open: true, org });
  };

  const confirmDelete = () => {
    if (deleteDialog.org) {
      deleteOrganization.mutate(deleteDialog.org.id);
      setDeleteDialog({ open: false, org: null });
    }
  };

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

  useEffect(() => {
    if (!data) return;

    if (data.length === 0) {
      // Pas d'organisation : on laisse afficher le message + bouton créer
      setHasChecked(true);
      // } else if (data.length === 1) {
      //   // 1 organisation : redirection automatique
      //   router.replace(`/preferences/organizations/${data[0].id}`);
    } else {
      // Plusieurs organisations : affichage liste
      setHasChecked(true);
    }
  }, [data, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <Skeleton className="h-9 w-[200px]" />
              <Skeleton className="h-4 w-[300px] mt-2" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-[100px]" />
              <Skeleton className="h-10 w-[150px]" />
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-12 h-12 rounded-xl" />
                      <div className="flex-1 min-w-0">
                        <Skeleton className="h-6 w-[120px]" />
                        <Skeleton className="h-4 w-[80px] mt-1" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-[60px]" />
                    <Skeleton className="h-3 w-[80px]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <p className="font-medium">Erreur de chargement</p>
              <p className="text-sm text-muted-foreground mt-1">
                {error.message}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasChecked) {
    // En attente du useEffect pour décider quoi afficher
    return null;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Aucune organisation</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Créez votre première organisation pour commencer
                </p>
              </div>
              <Button asChild>
                <Link href="/preferences/organizations/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer une organisation
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Plusieurs organisations => affichage liste avec liens
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Mes organisations</h1>
            <p className="text-muted-foreground mt-1">
              Gérez et accédez à vos organisations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg border p-1">
              <Button
                variant={viewMode === "cards" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className="h-8"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-8"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button asChild>
              <Link href="/preferences/organizations/create">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle organisation
              </Link>
            </Button>
          </div>
        </div>

        {viewMode === "cards" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.map((org) => (
              <Card
                key={org.id}
                className="group hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <Link href={`/preferences/organizations/${org.id}`} className="block">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center overflow-hidden">
                          {org.logo ? (
                            <img
                              src={org.logo}
                              alt={`Logo ${org.name}`}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          ) : (
                            <Building2 className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-xl truncate group-hover:text-primary transition-colors">
                            {org.name}
                          </CardTitle>
                          {org.domain && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {org.domain}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.preventDefault()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => { e.preventDefault(); handleEdit(org.id); }}>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.preventDefault(); handleDuplicate(org); }}>
                              <Copy className="h-4 w-4 mr-2" />
                              Dupliquer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={(e) => { e.preventDefault(); handleDelete(org); }}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="line-clamp-2 mb-4">
                      {org.description || "Aucune description disponible"}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        Créée récemment
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Liste des organisations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organisation</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Domaine</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((org) => (
                    <TableRow key={org.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
                            {org.logo ? (
                              <img
                                src={org.logo}
                                alt={`Logo ${org.name}`}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Building2 className="h-4 w-4 text-primary/50" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{org.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate text-muted-foreground">
                          {org.description || "Aucune description"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {org.domain ? (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {org.domain}
                          </div>
                        ) : (
                          <span className="text-muted-foreground/50">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/preferences/organizations/${org.id}`}>
                              Accéder
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </Link>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(org.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicate(org)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Dupliquer
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDelete(org)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, org: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'organisation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'organisation "{deleteDialog.org?.name}" ?
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
