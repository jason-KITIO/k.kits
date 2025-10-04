"use client";

import { useParams } from "next/navigation";
import { useOptimizedQuery } from "@/hooks/use-optimized-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Package, User, Calendar, MapPin, MoreHorizontal } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useCurrencyFormatter } from "@/hooks/use-currency";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type PurchaseOrderDetail = {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  expectedDate?: string;
  createdAt: string;
  supplier: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  user: {
    firstName: string;
    lastName: string;
  };
  warehouse: {
    name: string;
    address?: string;
  };
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    product: {
      name: string;
      sku: string;
    };
  }>;
};

export default function PurchaseOrderDetailPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const warehouseId = params.warehouseId as string;
  const orderId = params.orderId as string;
  const formatCurrency = useCurrencyFormatter(organizationId);
  const queryClient = useQueryClient();

  const markAsReceivedMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `/api/organization/${organizationId}/warehouses/${warehouseId}/purchase-orders/${orderId}/receive`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );
      if (!response.ok) {
        throw new Error('Erreur lors de la réception de la commande');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-order', organizationId, warehouseId, orderId] });
      queryClient.invalidateQueries({ queryKey: ['warehouse-stocks', organizationId, warehouseId] });
      toast.success('Commande marquée comme reçue et stock mis à jour');
    },
    onError: () => {
      toast.error('Erreur lors de la réception de la commande');
    },
  });

  const { data: order, isLoading } = useOptimizedQuery({
    queryKey: ['purchase-order', organizationId, warehouseId, orderId],
    queryFn: async (): Promise<PurchaseOrderDetail> => {
      const response = await fetch(
        `/api/organization/${organizationId}/warehouses/${warehouseId}/purchase-orders/${orderId}`,
        { credentials: 'include' }
      );
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de la commande');
      }
      return response.json();
    },
    enabled: !!organizationId && !!warehouseId && !!orderId,
  });

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      SHIPPED: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      RECEIVED: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    };
    return colors[status as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  if (isLoading) {
    return <div className="p-6">Chargement...</div>;
  }

  if (!order) {
    return <div className="p-6">Commande non trouvée</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/preferences/organizations/${organizationId}/warehouses/${warehouseId}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Commande {order.orderNumber}
                </h1>
                <div className="flex items-center gap-4 mt-1">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Créée le {order.createdAt ? format(new Date(order.createdAt), "PPP", { locale: fr }) : "Date inconnue"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(order.totalAmount)}
                </div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => markAsReceivedMutation.mutate()}
                    disabled={order.status === 'RECEIVED' || markAsReceivedMutation.isPending}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    {markAsReceivedMutation.isPending ? 'Traitement...' : 'Marquer comme reçue'}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Calendar className="h-4 w-4 mr-2" />
                    Modifier la date
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Informations générales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                Fournisseur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium text-foreground">{order.supplier.name}</p>
                {order.supplier.email && (
                  <p className="text-sm text-muted-foreground">{order.supplier.email}</p>
                )}
                {order.supplier.phone && (
                  <p className="text-sm text-muted-foreground">{order.supplier.phone}</p>
                )}
                {order.supplier.address && (
                  <p className="text-sm text-muted-foreground">{order.supplier.address}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                Entrepôt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium text-foreground">{order.warehouse.name}</p>
                {order.warehouse.address && (
                  <p className="text-sm text-muted-foreground">{order.warehouse.address}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                Livraison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium text-foreground">
                  {order.expectedDate && !isNaN(new Date(order.expectedDate).getTime())
                    ? format(new Date(order.expectedDate), "PPP", { locale: fr })
                    : "Non définie"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Commandé par {order.user.firstName} {order.user.lastName}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Articles */}
        <Card className="bg-card border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <Package className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              Articles commandés ({order.items.length})
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
                  {order.items.map((item) => (
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
            
            {/* Total */}
            <div className="mt-6 flex justify-end">
              <div className="bg-muted/50 rounded-lg p-4 min-w-[300px]">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-foreground">Total de la commande :</span>
                  <span className="text-xl font-bold text-foreground">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}