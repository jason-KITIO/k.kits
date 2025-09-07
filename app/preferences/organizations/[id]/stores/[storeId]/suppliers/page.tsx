"use client";

import { useParams } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useStoreHooks } from "@/hooks/useStore";

interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  active: boolean;
  createdAt: string;
}

const columns: ColumnDef<Supplier>[] = [
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
];

export default function SuppliersPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const storeId = params.storeId as string;

  const { data: suppliers = [], isLoading } = useStoreHooks.useSuppliers(organizationId, storeId);

  if (isLoading) return <PageLoader text="Chargement des fournisseurs..." />;

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
          <Link href={`/preferences/organizations/${organizationId}/stores/${storeId}/suppliers/new`}>
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