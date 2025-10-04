"use client";

import { useParams } from "next/navigation";
import {
  useWarehouse,
  useWarehouseStock,
  useWarehouseStockMovements,
  useWarehousePurchaseOrders,
} from "@/hooks/use-warehouses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Package,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Plus,
  Settings,
  Store,
  MoreHorizontal,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { StockAdjustmentDialog } from "@/components/warehouses/stock-adjustment-dialog";
import { CreatePurchaseOrderDialog } from "@/components/warehouses/create-purchase-order-dialog";
import { DeleteWarehouseDialog } from "@/components/warehouses/delete-warehouse-dialog";
import { StockTransferDialog } from "@/components/warehouses/stock-transfer-dialog";
import { StoreTransferDialog } from "@/components/warehouses/store-transfer-dialog";
import { RestockDialog } from "@/components/warehouses/restock-dialog";
import { useState, useEffect } from "react";
import { useCurrencyFormatter } from "@/hooks/use-currency";
import { Trash2, ArrowRightLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function WarehouseDetailsPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const warehouseId = params.warehouseId as string;
  
  console.log('Params complets:', params); // Debug
  console.log('OrganizationId:', organizationId); // Debug
  console.log('WarehouseId:', warehouseId); // Debug
  
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [storeTransferDialogOpen, setStoreTransferDialogOpen] = useState(false);
  const [restockDialogOpen, setRestockDialogOpen] = useState(false);
  const formatCurrency = useCurrencyFormatter(organizationId);
  const router = useRouter();
  const queryClient = useQueryClient();

  const markAsReceivedMutation = useMutation({
    mutationFn: async (orderId: string) => {
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
      queryClient.invalidateQueries({ queryKey: ['warehouse-purchase-orders', organizationId, warehouseId] });
      queryClient.invalidateQueries({ queryKey: ['warehouse-stocks', organizationId, warehouseId] });
      toast.success('Commande marquée comme reçue et stock mis à jour');
    },
    onError: () => {
      toast.error('Erreur lors de la réception de la commande');
    },
  });

  const { data: warehouse, isLoading: warehouseLoading } = useWarehouse(
    organizationId,
    warehouseId
  );
  const { data: stock, isLoading: stockLoading } = useWarehouseStock(
    organizationId,
    warehouseId
  );
  const { data: movements, isLoading: movementsLoading } =
    useWarehouseStockMovements(organizationId, warehouseId);
  const { data: purchaseOrders, isLoading: ordersLoading } =
    useWarehousePurchaseOrders(organizationId, warehouseId);

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

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-blue-100 text-blue-800",
      SHIPPED: "bg-purple-100 text-purple-800",
      RECEIVED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (!warehouseId || warehouseId === 'undefined') {
    return (
      <div className="p-6">
        <p>ID d'entrepôt manquant</p>
        <p>Params: {JSON.stringify(params)}</p>
        <p>WarehouseId: {warehouseId}</p>
      </div>
    );
  }

  if (warehouseLoading) {
    return <div className="p-6">Chargement...</div>;
  }

  if (!warehouse) {
    return <div className="p-6">Entrepôt non trouvé</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link
            href={`/preferences/organizations/${organizationId}/warehouses`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{warehouse.name}</h1>
          <p className="text-muted-foreground">Détails de l'entrepôt</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setAdjustmentDialogOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Ajuster stock
          </Button>
          <Button onClick={() => setOrderDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle commande
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setRestockDialogOpen(true)}>
                <Package className="h-4 w-4 mr-2" />
                Recharger produits
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setTransferDialogOpen(true)}
                disabled={!stock || stock.length === 0}
              >
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Transférer vers entrepôt
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setStoreTransferDialogOpen(true)}
                disabled={!stock || stock.length === 0}
              >
                <Store className="h-4 w-4 mr-2" />
                Transférer vers boutique
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/preferences/organizations/${organizationId}/warehouses/${warehouseId}/edit`}>
                  <Settings className="h-4 w-4 mr-2" />
                  Modifier l'entrepôt
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/preferences/organizations/${organizationId}/warehouses/new?duplicate=${warehouseId}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Dupliquer l'entrepôt
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setDeleteDialogOpen(true)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer l'entrepôt
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Produits en stock
                </p>
                <p className="text-2xl font-bold">{stock?.length || 0}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Quantité totale
                </p>
                <p className="text-2xl font-bold">
                  {stock?.reduce((sum: number, item) => sum + item.quantity, 0) || 0}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Commandes en cours
                </p>
                <p className="text-2xl font-bold">
                  {purchaseOrders?.filter(
                    (order) =>
                      order.status !== "RECEIVED" &&
                      order.status !== "CANCELLED"
                  ).length || 0}
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Valeur du stock
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    stock?.reduce(
                      (sum: number, item) =>
                        sum + item.quantity * item.product.unitPrice,
                      0
                    ) || 0
                  )}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="stock" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="movements">Mouvements</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
        </TabsList>

        <TabsContent value="stock">
          <Card>
            <CardHeader>
              <CardTitle>Stock actuel</CardTitle>
            </CardHeader>
            <CardContent>
              {stockLoading ? (
                <TableSkeleton columns={6} />
              ) : (
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
                        <TableCell className="font-medium">
                          {item.product.name}
                        </TableCell>
                        <TableCell>{item.product.sku}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.reservedQuantity}</TableCell>
                        <TableCell>
                          {formatCurrency(item.product.unitPrice)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(item.quantity * item.product.unitPrice)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements">
          <Card>
            <CardHeader>
              <CardTitle>Mouvements de stock</CardTitle>
            </CardHeader>
            <CardContent>
              {movementsLoading ? (
                <TableSkeleton columns={6} />
              ) : (
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
                        <TableCell>
                          {movement.user.firstName} {movement.user.lastName}
                        </TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(movement.createdAt), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </TableCell>
                        <TableCell>{movement.reference || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Commandes d'achat</CardTitle>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <TableSkeleton columns={6} />
              ) : (
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
                    {purchaseOrders?.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell>{order.supplier.name}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatCurrency(order.totalAmount)}
                        </TableCell>
                        <TableCell>
                          {order.expectedDate
                            ? new Date(order.expectedDate).toLocaleDateString(
                                "fr-FR"
                              )
                            : "-"}
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
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => markAsReceivedMutation.mutate(order.id)}
                                disabled={markAsReceivedMutation.isPending}
                              >
                                <Package className="h-4 w-4 mr-2" />
                                {markAsReceivedMutation.isPending ? 'Traitement...' : 'Recevoir'}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <StockAdjustmentDialog
        open={adjustmentDialogOpen}
        onOpenChange={setAdjustmentDialogOpen}
        organizationId={organizationId}
        warehouseId={warehouseId}
      />

      <CreatePurchaseOrderDialog
        open={orderDialogOpen}
        onOpenChange={setOrderDialogOpen}
        organizationId={organizationId}
        warehouseId={warehouseId}
      />

      <StockTransferDialog
        open={transferDialogOpen}
        onOpenChange={setTransferDialogOpen}
        organizationId={organizationId}
        fromWarehouseId={warehouseId}
        fromWarehouseName={warehouse.name}
        stock={stock || []}
      />

      <StoreTransferDialog
        open={storeTransferDialogOpen}
        onOpenChange={setStoreTransferDialogOpen}
        organizationId={organizationId}
        warehouseId={warehouseId}
        warehouseName={warehouse.name}
        stock={stock || []}
      />

      <DeleteWarehouseDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        warehouseId={warehouseId}
        warehouseName={warehouse.name}
        organizationId={organizationId}
        onSuccess={() => router.push(`/preferences/organizations/${organizationId}/warehouses`)}
      />

      <RestockDialog
        open={restockDialogOpen}
        onOpenChange={setRestockDialogOpen}
        organizationId={organizationId}
        warehouseId={warehouseId}
      />
    </div>
  );
}
