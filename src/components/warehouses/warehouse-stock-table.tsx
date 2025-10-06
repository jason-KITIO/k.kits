"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { useCurrencyFormatter } from "@/hooks/use-currency";

interface StockItem {
  id: string;
  quantity: number;
  reservedQuantity: number;
  product: {
    name: string;
    sku: string;
    unitPrice: number;
  };
}

interface WarehouseStockTableProps {
  organizationId: string;
  stock: StockItem[] | undefined;
  isLoading: boolean;
}

export function WarehouseStockTable({ organizationId, stock, isLoading }: WarehouseStockTableProps) {
  const formatCurrency = useCurrencyFormatter(organizationId);

  if (isLoading) return <TableSkeleton columns={6} />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Produit</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Quantité</TableHead>
          <TableHead>Réservé</TableHead>
          <TableHead>Prix unitaire</TableHead>
          <TableHead>Valeur totale</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stock?.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.product.name}</TableCell>
            <TableCell>{item.product.sku}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>{item.reservedQuantity}</TableCell>
            <TableCell>{formatCurrency(item.product.unitPrice)}</TableCell>
            <TableCell>{formatCurrency(item.quantity * item.product.unitPrice)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
