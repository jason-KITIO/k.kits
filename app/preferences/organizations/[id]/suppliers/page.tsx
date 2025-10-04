"use client";

import { useParams } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, Plus, Edit, Trash2, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSuppliers, useDeleteSupplier } from "@/hooks/useSuppliers";
import { type Supplier } from "@/services/supplierService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

function SupplierActions({ supplier, organizationId }: { supplier: Supplier; organizationId: string }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteSupplier = useDeleteSupplier(organizationId);

  const handleDelete = async () => {
    await deleteSupplier.mutateAsync(supplier.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/preferences/organizations/${organizationId}/suppliers/${supplier.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              Détails
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/preferences/organizations/${organizationId}/suppliers/${supplier.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le fournisseur</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le fournisseur "{supplier.name}" ?
              Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteSupplier.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteSupplier.isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function getColumns(organizationId: string): ColumnDef<Supplier>[] {
  return [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nom
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "contactPerson",
    header: "Contact",
    cell: ({ row }) => row.getValue("contactPerson") || "Non renseigné",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.getValue("email") || "Non renseigné",
  },
  {
    accessorKey: "phone",
    header: "Téléphone",
    cell: ({ row }) => row.getValue("phone") || "Non renseigné",
  },
  {
    accessorKey: "active",
    header: "Statut",
    cell: ({ row }) => (
      <Badge variant={row.getValue("active") ? "default" : "secondary"}>
        {row.getValue("active") ? "Actif" : "Inactif"}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Créé le",
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
  },
    {
      id: "actions",
      cell: ({ row }) => {
        const supplier = row.original;
        return <SupplierActions supplier={supplier} organizationId={organizationId} />;
      },
    },
  ];
}

export default function SuppliersPage() {
  const params = useParams();
  const organizationId = params.id as string;

  const { data: suppliers = [], isLoading } = useSuppliers(organizationId);
  const columns = getColumns(organizationId);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-8" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.active).length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fournisseurs</h1>
          <p className="text-muted-foreground">
            Gérez vos partenaires commerciaux
          </p>
        </div>
        <Button asChild>
          <Link href={`/preferences/organizations/${organizationId}/suppliers/new`}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau fournisseur
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total fournisseurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSuppliers}</div>
            <p className="text-xs text-muted-foreground">Partenaires enregistrés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeSuppliers}</div>
            <p className="text-xs text-muted-foreground">Fournisseurs actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inactifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{totalSuppliers - activeSuppliers}</div>
            <p className="text-xs text-muted-foreground">Fournisseurs inactifs</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des fournisseurs</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={suppliers}
            searchKey="name"
            searchPlaceholder="Rechercher un fournisseur..."
            isLoading={isLoading}
            emptyMessage="Aucun fournisseur trouvé"
          />
        </CardContent>
      </Card>
    </div>
  );
}