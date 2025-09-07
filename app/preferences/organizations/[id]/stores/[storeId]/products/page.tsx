"use client";

import { useParams } from "next/navigation";
import { useStoreProducts } from "@/hooks/useStore";
import { DataTable } from "@/components/ui/data-table";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Package, Plus, Eye, Scan } from "lucide-react";
import { Product } from "@/services/storeService";
import Link from "next/link";

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue("sku")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nom du produit
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "category.name",
    header: "Catégorie",
    cell: ({ row }) => row.original.category?.name || "Non classé",
  },
  {
    accessorKey: "unitPrice",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Prix
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-semibold">
        {row.getValue<number>("unitPrice").toLocaleString()} FCFA
      </div>
    ),
  },
  {
    accessorKey: "stocks",
    header: "Stock",
    cell: ({ row }) => {
      const stocks = row.original.stocks || [];
      const totalStock = stocks.reduce((sum, stock) => sum + stock.quantity, 0);
      const minStock = row.original.minStock;
      
      return (
        <div className="flex items-center gap-2">
          <span className={totalStock <= minStock ? "text-red-600 font-semibold" : ""}>
            {totalStock}
          </span>
          {totalStock <= minStock && (
            <Badge variant="destructive" className="text-xs">
              Stock bas
            </Badge>
          )}
        </div>
      );
    },
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
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      );
    },
  },
];

export default function StoreProductsPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const storeId = params.storeId as string;

  const { data: products, isLoading, error } = useStoreProducts(organizationId, storeId);

  if (isLoading) return <PageLoader text="Chargement des produits..." />;
  if (error) return <div>Erreur: {error.message}</div>;

  const activeProducts = products?.filter(p => p.active).length || 0;
  const lowStockProducts = products?.filter(p => {
    const totalStock = p.stocks?.reduce((sum, stock) => sum + stock.quantity, 0) || 0;
    return totalStock <= p.minStock;
  }).length || 0;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Produits</h1>
          <p className="text-muted-foreground">
            Catalogue des produits de la boutique
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Scan className="h-4 w-4 mr-2" />
            Scanner
          </Button>
          <Button asChild>
            <Link href={`/preferences/organizations/${organizationId}/stores/${storeId}/products/new`}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau produit
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total produits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Références</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Produits actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeProducts}</div>
            <p className="text-xs text-muted-foreground">En vente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stock bas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">À réapprovisionner</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Catalogue produits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={products || []}
            searchKey="name"
            searchPlaceholder="Rechercher un produit..."
          />
        </CardContent>
      </Card>
    </div>
  );
}