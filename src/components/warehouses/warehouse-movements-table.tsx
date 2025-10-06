"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { TrendingUp, TrendingDown, Package } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Movement {
  id: string;
  type: string;
  quantity: number;
  reference: string | null;
  createdAt: string;
  product: { name: string };
  user: { firstName: string; lastName: string };
}

interface WarehouseMovementsTableProps {
  movements: Movement[] | undefined;
  isLoading: boolean;
}

const getMovementIcon = (type: string) => {
  switch (type) {
    case "IN":
    case "PURCHASE":
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    case "OUT":
    case "SALE":
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    default:
      return <Package className="h-4 w-4 text-blue-600" />;
  }
};

export function WarehouseMovementsTable({ movements, isLoading }: WarehouseMovementsTableProps) {
  if (isLoading) return <TableSkeleton columns={6} />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Produit</TableHead>
          <TableHead>Quantité</TableHead>
          <TableHead>Utilisateur</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Référence</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {movements?.map((movement) => (
          <TableRow key={movement.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                {getMovementIcon(movement.type)}
                {movement.type}
              </div>
            </TableCell>
            <TableCell>{movement.product.name}</TableCell>
            <TableCell>{movement.quantity}</TableCell>
            <TableCell>{movement.user.firstName} {movement.user.lastName}</TableCell>
            <TableCell>
              {formatDistanceToNow(new Date(movement.createdAt), { addSuffix: true, locale: fr })}
            </TableCell>
            <TableCell>{movement.reference || "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
