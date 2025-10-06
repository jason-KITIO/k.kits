"use client";

import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Settings } from "lucide-react";
import { Stock } from "@/types/stock";

interface StockTableProps {
  data: Stock[];
  onAdjust?: (stock: Stock) => void;
}

export function StockTable({ data, onAdjust }: StockTableProps) {
  const columns: ColumnDef<Stock>[] = [
    {
      id: "productSku",
      accessorFn: (row) => row.product.sku,
      header: "SKU",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.original.product.sku}</div>
      ),
    },
    {
      id: "productName",
      accessorFn: (row) => row.product.name,
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Produit
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.original.product.name}</div>
      ),
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantité
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const quantity = row.getValue<number>("quantity");
        const minStock = row.original.product.minStock;
        
        return (
          <div className="flex items-center gap-2">
            <span className={quantity <= minStock ? "text-red-600 font-semibold" : "font-semibold"}>
              {quantity}
            </span>
            {quantity <= minStock && (
              <Badge variant="destructive" className="text-xs">
                Stock bas
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "minStock",
      accessorFn: (row) => row.product.minStock,
      header: "Seuil min",
      cell: ({ row }) => row.original.product.minStock,
    },
    {
      accessorKey: "reservedQuantity",
      header: "Réservé",
      cell: ({ row }) => row.getValue("reservedQuantity") || 0,
    },
    {
      accessorKey: "lastUpdated",
      header: "Dernière MAJ",
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.getValue<string>("lastUpdated")).toLocaleDateString()}
        </div>
      ),
    },
    ...(onAdjust ? [{
      id: "actions",
      cell: ({ row }: { row: any }) => (
        <Button variant="ghost" size="sm" onClick={() => onAdjust(row.original)}>
          <Settings className="h-4 w-4" />
        </Button>
      ),
    }] : []),
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="productName"
      searchPlaceholder="Rechercher un produit..."
    />
  );
}