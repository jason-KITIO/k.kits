"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Plus, Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useProducts, useDeleteProduct, type Product } from "@/hooks/useProducts";
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

function ProductActions({ product, organizationId }: { product: Product; organizationId: string }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteProduct = useDeleteProduct(organizationId);

  const handleDelete = async () => {
    await deleteProduct.mutateAsync(product.id);
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
            <Link href={`/preferences/organizations/${organizationId}/products/${product.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              Détails
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/preferences/organizations/${organizationId}/products/${product.id}/edit`}>
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
            <AlertDialogTitle>Supprimer le produit</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le produit "{product.name}" ?
              Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteProduct.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteProduct.isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function getColumns(organizationId: string): ColumnDef<Product>[] {
  return [
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => (
        <code className="text-sm bg-muted px-2 py-1 rounded">
          {row.getValue("sku")}
        </code>
      ),
    },
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
      accessorKey: "category",
      header: "Catégorie",
      cell: ({ row }) => {
        const category = row.original.category;
        return category ? category.name : "Non classé";
      },
    },
    {
      accessorKey: "supplier",
      header: "Fournisseur",
      cell: ({ row }) => {
        const supplier = row.original.supplier;
        return supplier ? supplier.name : "Non renseigné";
      },
    },
    {
      accessorKey: "unitPrice",
      header: "Prix vente",
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("unitPrice"));
        return new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "XAF",
        }).format(price);
      },
    },
    {
      accessorKey: "costPrice",
      header: "Prix achat",
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("costPrice"));
        return new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "XAF",
        }).format(price);
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
      accessorKey: "createdAt",
      header: "Créé le",
      cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;
        return <ProductActions product={product} organizationId={organizationId} />;
      },
    },
  ];
}

export default function ProductsPage() {
  const params = useParams();
  const organizationId = params.id as string;

  const { data: products = [], isLoading } = useProducts(organizationId);
  const columns = getColumns(organizationId);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-5 w-80 mt-2" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
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
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
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

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.active).length;
  const totalValue = products.reduce((sum, p) => sum + (p.unitPrice * 1), 0); // Assuming quantity of 1 for value calculation
  const avgPrice = totalProducts > 0 ? totalValue / totalProducts : 0;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Produits</h1>
          <p className="text-muted-foreground">
            Gérez le catalogue de produits de votre organisation
          </p>
        </div>
        <Button asChild>
          <Link href={`/preferences/organizations/${organizationId}/products/new`}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau produit
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total produits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Articles au catalogue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeProducts}</div>
            <p className="text-xs text-muted-foreground">Produits actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inactifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{totalProducts - activeProducts}</div>
            <p className="text-xs text-muted-foreground">Produits inactifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Prix moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "XAF",
              }).format(avgPrice)}
            </div>
            <p className="text-xs text-muted-foreground">Prix de vente moyen</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des produits</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={products}
            searchKey="name"
            searchPlaceholder="Rechercher un produit..."
            isLoading={isLoading}
            emptyMessage="Aucun produit trouvé"
          />
        </CardContent>
      </Card>
    </div>
  );
}