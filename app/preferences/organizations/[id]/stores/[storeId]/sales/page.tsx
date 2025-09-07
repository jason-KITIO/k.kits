"use client";

import { useParams } from "next/navigation";
import { useStoreSales, useCreateSale } from "@/hooks/useStore";
import { DataTable } from "@/components/ui/data-table";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ShoppingCart, Plus, Eye, Receipt } from "lucide-react";
import { Sale } from "@/services/organizationService";
import Link from "next/link";

const columns: ColumnDef<Sale>[] = [
  {
    accessorKey: "id",
    header: "N° Vente",
    cell: ({ row }) => (
      <div className="font-mono text-sm">
        #{row.getValue("id")?.toString().slice(-6)}
      </div>
    ),
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
    accessorKey: "paidAmount",
    header: "Payé",
    cell: ({ row }) => (
      <div className="text-green-600 font-medium">
        {row.getValue<number>("paidAmount").toLocaleString()} FCFA
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
      
      const labels = {
        PENDING: "En attente",
        PAID: "Payé",
        PARTIAL: "Partiel",
        CANCELLED: "Annulé",
        REFUNDED: "Remboursé",
      };
      
      return (
        <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
          {labels[status as keyof typeof labels] || status}
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
      <div className="text-sm">
        {new Date(row.getValue<string>("saleDate")).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "items",
    header: "Articles",
    cell: ({ row }) => {
      const items = row.original.items || [];
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      return <div className="text-sm">{totalItems} article(s)</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const sale = row.original;
      return (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Receipt className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

export default function StoreSalesPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const storeId = params.storeId as string;

  const { data: sales, isLoading, error } = useStoreSales(organizationId, storeId);

  if (isLoading) return <PageLoader text="Chargement des ventes..." />;
  if (error) return <div>Erreur: {error.message}</div>;

  const totalSales = sales?.length || 0;
  const totalAmount = sales?.reduce((sum, sale) => sum + sale.totalAmount, 0) || 0;
  const paidAmount = sales?.reduce((sum, sale) => sum + sale.paidAmount, 0) || 0;
  const pendingSales = sales?.filter(s => s.status === 'PENDING').length || 0;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ventes</h1>
          <p className="text-muted-foreground">
            Historique et gestion des ventes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Receipt className="h-4 w-4 mr-2" />
            Rapports
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle vente
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total ventes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
            <p className="text-xs text-muted-foreground">Transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalAmount.toLocaleString()} FCFA
            </div>
            <p className="text-xs text-muted-foreground">Total facturé</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Encaissé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {paidAmount.toLocaleString()} FCFA
            </div>
            <p className="text-xs text-muted-foreground">Montant perçu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingSales}</div>
            <p className="text-xs text-muted-foreground">Ventes non payées</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Historique des ventes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={sales || []}
            searchKey="id"
            searchPlaceholder="Rechercher par numéro de vente..."
          />
        </CardContent>
      </Card>
    </div>
  );
}