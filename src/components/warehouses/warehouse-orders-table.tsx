"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Package } from "lucide-react";
import Link from "next/link";
import { useCurrencyFormatter } from "@/hooks/use-currency";

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  expectedDate: string | null;
  supplier: { name: string };
}

interface WarehouseOrdersTableProps {
  organizationId: string;
  warehouseId: string;
  orders: PurchaseOrder[] | undefined;
  isLoading: boolean;
  onMarkAsReceived: (orderId: string) => void;
  isMarkingReceived: boolean;
}

const getStatusColor = (status: string) => {
  const colors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    RECEIVED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };
  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

export function WarehouseOrdersTable({ organizationId, warehouseId, orders, isLoading, onMarkAsReceived, isMarkingReceived }: WarehouseOrdersTableProps) {
  const formatCurrency = useCurrencyFormatter(organizationId);

  if (isLoading) return <TableSkeleton columns={6} />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>N° Commande</TableHead>
          <TableHead>Fournisseur</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Montant total</TableHead>
          <TableHead>Date prévue</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders?.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.orderNumber}</TableCell>
            <TableCell>{order.supplier.name}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
            </TableCell>
            <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
            <TableCell>
              {order.expectedDate ? new Date(order.expectedDate).toLocaleDateString("fr-FR") : "-"}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/preferences/organizations/${organizationId}/warehouses/${warehouseId}/purchase-orders/${order.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    Voir
                  </Link>
                </Button>
                {order.status !== 'RECEIVED' && (
                  <Button variant="outline" size="sm" onClick={() => onMarkAsReceived(order.id)} disabled={isMarkingReceived}>
                    <Package className="h-4 w-4 mr-2" />
                    {isMarkingReceived ? 'Traitement...' : 'Recevoir'}
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
