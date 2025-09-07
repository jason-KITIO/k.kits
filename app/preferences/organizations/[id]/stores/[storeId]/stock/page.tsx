"use client";

import { useParams } from "next/navigation";
import { useStoreStock, useCreateStockAdjustment } from "@/hooks/useStore";
import { DataTable } from "@/components/ui/data-table";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Package, Settings, AlertTriangle, TrendingUp } from "lucide-react";
import { Stock } from "@/services/storeService";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { stockAdjustmentSchema, type StockAdjustmentInput } from "@/schema/stock-movement.schema";

const columns: ColumnDef<Stock>[] = [
  {
    accessorKey: "product.sku",
    header: "SKU",
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.original.product.sku}</div>
    ),
  },
  {
    accessorKey: "product.name",
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
    accessorKey: "product.minStock",
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
  {
    id: "actions",
    cell: ({ row }) => {
      const stock = row.original;
      return (
        <AdjustmentDialog stock={stock} />
      );
    },
  },
];

function AdjustmentDialog({ stock }: { stock: Stock }) {
  const params = useParams();
  const organizationId = params.id as string;
  const storeId = params.storeId as string;
  const [open, setOpen] = useState(false);
  
  const createAdjustment = useCreateStockAdjustment(organizationId, storeId);
  
  const form = useForm<StockAdjustmentInput>({
    resolver: zodResolver(stockAdjustmentSchema),
    defaultValues: {
      productId: stock.productId,
      quantity: 0,
      reason: "",
    },
  });

  const onSubmit = (data: StockAdjustmentInput) => {
    createAdjustment.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajuster le stock</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Produit</Label>
            <div className="text-sm text-muted-foreground">
              {stock.product.name} (Stock actuel: {stock.quantity})
            </div>
          </div>
          
          <div>
            <Label htmlFor="quantity">Quantité d'ajustement</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="Ex: +10 ou -5"
              {...form.register("quantity", { valueAsNumber: true })}
            />
            <div className="text-xs text-muted-foreground mt-1">
              Utilisez + pour ajouter, - pour retirer
            </div>
          </div>
          
          <div>
            <Label htmlFor="reason">Motif</Label>
            <Textarea
              id="reason"
              placeholder="Raison de l'ajustement..."
              {...form.register("reason")}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={createAdjustment.isPending}>
              {createAdjustment.isPending ? "Ajustement..." : "Ajuster"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function StoreStockPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const storeId = params.storeId as string;

  const { data: stocks, isLoading, error } = useStoreStock(organizationId, storeId);

  if (isLoading) return <PageLoader text="Chargement des stocks..." />;
  if (error) return <div>Erreur: {error.message}</div>;

  const totalProducts = stocks?.length || 0;
  const lowStockCount = stocks?.filter(s => s.quantity <= s.product.minStock).length || 0;
  const totalValue = stocks?.reduce((sum, stock) => 
    sum + (stock.quantity * stock.product.unitPrice), 0) || 0;
  const outOfStock = stocks?.filter(s => s.quantity === 0).length || 0;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stock</h1>
          <p className="text-muted-foreground">
            État des stocks et ajustements
          </p>
        </div>
        <Button>
          <TrendingUp className="h-4 w-4 mr-2" />
          Mouvement de stock
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Produits en stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Références</p>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Stock bas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Produits concernés</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">Rupture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{outOfStock}</div>
            <p className="text-xs text-muted-foreground">Stock épuisé</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valeur totale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalValue.toLocaleString()} FCFA</div>
            <p className="text-xs text-muted-foreground">Valeur du stock</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            État des stocks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={stocks || []}
            searchKey="product.name"
            searchPlaceholder="Rechercher un produit..."
          />
        </CardContent>
      </Card>
    </div>
  );
}