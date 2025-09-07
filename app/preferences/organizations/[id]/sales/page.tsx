"use client";

import { useParams } from "next/navigation";
import { useOrganizationSales } from "@/hooks/useOrganization";
import { DataTable } from "@/components/ui/data-table";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, Plus } from "lucide-react";
import { Sale } from "@/services/organizationService";
import Link from "next/link";

const columns: ColumnDef<Sale>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        ID Vente
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-mono text-sm">
        {row.getValue("id")?.toString().slice(-8)}
      </div>
    ),
  },
  {
    accessorKey: "store.name",
    header: "Boutique",
    cell: ({ row }) => row.original.store.name,
  },
  {
    accessorKey: "customer.name",
    header: "Client",
    cell: ({ row }) => row.original.customer?.name || "Client comptoir",
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Montant
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-semibold">
        {row.getValue<number>("totalAmount").toLocaleString()} FCFA
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue<string>("status");
      const variants = {
        PENDING: "secondary",
        PAID: "default",
        PARTIAL: "outline",
        CANCELLED: "destructive",
        REFUNDED: "secondary",
      } as const;

      return (
        <Badge
          variant={variants[status as keyof typeof variants] || "secondary"}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "saleDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        {new Date(row.getValue<string>("saleDate")).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "user",
    header: "Vendeur",
    cell: ({ row }) => {
      const user = row.original.user;
      return `${user.firstName || ""} ${user.lastName || ""}`.trim() || "N/A";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const sale = row.original;
      return (
        <Button variant="ghost" size="sm" asChild>
          <Link
            href={`/preferences/organizations/${sale.organizationId}/stores/${sale.storeId}/sales/${sale.id}`}
          >
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      );
    },
  },
];

export default function OrganizationSalesPage() {
  const params = useParams();
  const organizationId = params.id as string;

  const {
    data: sales,
    isLoading,
    error,
  } = useOrganizationSales(organizationId);

  if (isLoading) return <PageLoader text="Chargement des ventes..." />;
  if (error) return <div>Erreur: {error.message}</div>;

  const totalAmount =
    sales?.reduce((sum, sale) => sum + sale.totalAmount, 0) || 0;
  const totalSales = sales?.length || 0;
  const averageAmount = totalSales > 0 ? totalAmount / totalSales : 0;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ventes</h1>
          <p className="text-muted-foreground">
            Gestion des ventes de toutes les boutiques
          </p>
        </div>
        {/* <Button asChild>
          <Link href={`/preferences/organizations/${organizationId}/stores`}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle vente
          </Link>
        </Button> */}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total des ventes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
            <p className="text-xs text-muted-foreground">Ventes enregistrées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Chiffre d'affaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAmount.toLocaleString()} FCFA
            </div>
            <p className="text-xs text-muted-foreground">Montant total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Panier moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageAmount.toLocaleString()} FCFA
            </div>
            <p className="text-xs text-muted-foreground">Par vente</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des ventes</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={sales || []}
            searchKey="id"
            searchPlaceholder="Rechercher par ID de vente..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
