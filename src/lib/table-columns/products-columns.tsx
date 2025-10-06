"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { ProductActions } from "@/components/molecules/products/ProductActions";
import { Product } from "@/hooks/useProducts";

export function getProductsColumns(organizationId: string): ColumnDef<Product>[] {
  return [
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => (
        <code className="text-sm bg-muted px-2 py-1 rounded">{row.getValue("sku")}</code>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Nom
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "category",
      header: "Catégorie",
      cell: ({ row }) => row.original.category?.name || "Non classé",
    },
    {
      accessorKey: "supplier",
      header: "Fournisseur",
      cell: ({ row }) => row.original.supplier?.name || "Non renseigné",
    },
    {
      accessorKey: "unitPrice",
      header: "Prix vente",
      cell: ({ row }) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XAF" }).format(parseFloat(row.getValue("unitPrice"))),
    },
    {
      accessorKey: "costPrice",
      header: "Prix achat",
      cell: ({ row }) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XAF" }).format(parseFloat(row.getValue("costPrice"))),
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
      cell: ({ row }) => <ProductActions product={row.original} organizationId={organizationId} />,
    },
  ];
}
