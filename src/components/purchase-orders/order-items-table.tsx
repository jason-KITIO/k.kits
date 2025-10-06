"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package } from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  product: {
    name: string;
    sku: string;
  };
}

interface OrderItemsTableProps {
  items: OrderItem[];
  totalAmount: number;
  formatCurrency: (amount: number) => string;
}

export function OrderItemsTable({ items, totalAmount, formatCurrency }: OrderItemsTableProps) {
  return (
    <Card className="bg-card border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <Package className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </div>
          Articles commandés ({items.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold text-foreground">Produit</TableHead>
                <TableHead className="font-semibold text-foreground">SKU</TableHead>
                <TableHead className="font-semibold text-foreground">Quantité</TableHead>
                <TableHead className="font-semibold text-foreground">Prix unitaire</TableHead>
                <TableHead className="font-semibold text-foreground">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-foreground">{item.product.name}</TableCell>
                  <TableCell className="text-muted-foreground">{item.product.sku}</TableCell>
                  <TableCell className="font-medium text-foreground">{item.quantity}</TableCell>
                  <TableCell className="text-foreground">{formatCurrency(item.unitPrice)}</TableCell>
                  <TableCell className="font-medium text-foreground">{formatCurrency(item.totalAmount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6 flex justify-end">
          <div className="bg-muted/50 rounded-lg p-4 min-w-[300px]">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-foreground">Total de la commande :</span>
              <span className="text-xl font-bold text-foreground">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}