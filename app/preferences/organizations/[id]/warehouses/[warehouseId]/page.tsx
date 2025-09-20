"use client";

import { useParams } from "next/navigation";
import { useWarehouse, useWarehouseStock, useWarehouseStockMovements, useWarehousePurchaseOrders } from "@/hooks/use-warehouses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Package, TrendingUp, TrendingDown, ShoppingCart, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { StockAdjustmentDialog } from "@/components/warehouses/stock-adjustment-dialog";
import { CreatePurchaseOrderDialog } from "@/components/warehouses/create-purchase-order-dialog";
import { useState } from "react";

export default function WarehouseDetailsPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const warehouseId = params.warehouseId as string;
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);

  const { data: warehouse, isLoading: warehouseLoading } = useWarehouse(organizationId, warehouseId);
  const { data: stock, isLoading: stockLoading } = useWarehouseStock(organizationId, warehouseId);
  const { data: movements, isLoading: movementsLoading } = useWarehouseStockMovements(organizationId, warehouseId);
  const { data: purchaseOrders, isLoading: ordersLoading } = useWarehousePurchaseOrders(organizationId, warehouseId);

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'IN':
      case 'PURCHASE':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'OUT':
      case 'SALE':
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
      CANCELLED: "bg-red-100 text-red-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

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
          <Link href={`/preferences/organizations/${organizationId}/warehouses`}>
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Produits en stock</p>
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
                <p className="text-sm font-medium text-muted-foreground">Quantité totale</p>
                <p className="text-2xl font-bold">
                  {stock?.reduce((sum, item) => sum + item.quantity, 0) || 0}
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
                <p className="text-sm font-medium text-muted-foreground">Commandes en cours</p>
                <p className="text-2xl font-bold">
                  {purchaseOrders?.filter(order => order.status !== 'RECEIVED' && order.status !== 'CANCELLED').length || 0}
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
                <p className="text-sm font-medium text-muted-foreground">Valeur du stock</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat('fr-FR', { 
                    style: 'currency', 
                    currency: 'EUR' 
                  }).format(
                    stock?.reduce((sum, item) => sum + (item.quantity * item.product.unitPrice), 0) || 0
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
                <div>Chargement...</div>
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
                        <TableCell className="font-medium">{item.product.name}</TableCell>
                        <TableCell>{item.product.sku}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.reservedQuantity}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('fr-FR', { 
                            style: 'currency', 
                            currency: 'EUR' 
                          }).format(item.product.unitPrice)}
                        </TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('fr-FR', { 
                            style: 'currency', 
                            currency: 'EUR' 
                          }).format(item.quantity * item.product.unitPrice)}
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
                <div>Chargement...</div>
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
                            locale: fr 
                          })}
                        </TableCell>
                        <TableCell>{movement.reference || '-'}</TableCell>
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
                <div>Chargement...</div>
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
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{order.supplier.name}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('fr-FR', { 
                            style: 'currency', 
                            currency: 'EUR' 
                          }).format(order.totalAmount)}
                        </TableCell>
                        <TableCell>
                          {order.expectedDate ? 
                            new Date(order.expectedDate).toLocaleDateString('fr-FR') : 
                            '-'
                          }
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Voir détails
                          </Button>
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
    </div>
  );
}