"use client";

import { useParams, useRouter } from "next/navigation";
import { useWarehouse, useWarehouseStock, useWarehouseStockMovements, useWarehousePurchaseOrders } from "@/hooks/use-warehouses";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { StockAdjustmentDialog } from "@/components/warehouses/stock-adjustment-dialog";
import { CreatePurchaseOrderDialog } from "@/components/warehouses/create-purchase-order-dialog";
import { DeleteWarehouseDialog } from "@/components/warehouses/delete-warehouse-dialog";
import { StockTransferDialog } from "@/components/warehouses/stock-transfer-dialog";
import { StoreTransferDialog } from "@/components/warehouses/store-transfer-dialog";
import { RestockDialog } from "@/components/warehouses/restock-dialog";
import { WarehouseStatsCards } from "@/components/warehouses/warehouse-stats-cards";
import { WarehouseActionsMenu } from "@/components/warehouses/warehouse-actions-menu";
import { WarehouseStockTable } from "@/components/warehouses/warehouse-stock-table";
import { WarehouseMovementsTable } from "@/components/warehouses/warehouse-movements-table";
import { WarehouseOrdersTable } from "@/components/warehouses/warehouse-orders-table";
import { useWarehouseDialogs } from "@/hooks/use-warehouse-dialogs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function WarehouseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const organizationId = params.id as string;
  const warehouseId = params.warehouseId as string;
  
  const dialogs = useWarehouseDialogs();

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

  if (!warehouseId || warehouseId === 'undefined') {
    return <div className="p-6">ID d'entrepôt manquant</div>;
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
          <Button onClick={() => dialogs.setAdjustmentDialogOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Ajuster stock
          </Button>
          <Button onClick={() => dialogs.setOrderDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle commande
          </Button>
          <WarehouseActionsMenu
            organizationId={organizationId}
            warehouseId={warehouseId}
            hasStock={!!stock && stock.length > 0}
            onRestock={() => dialogs.setRestockDialogOpen(true)}
            onTransfer={() => dialogs.setTransferDialogOpen(true)}
            onStoreTransfer={() => dialogs.setStoreTransferDialogOpen(true)}
            onDelete={() => dialogs.setDeleteDialogOpen(true)}
          />
        </div>
      </div>

      <WarehouseStatsCards organizationId={organizationId} stock={stock} purchaseOrders={purchaseOrders} />

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
              <WarehouseStockTable organizationId={organizationId} stock={stock} isLoading={stockLoading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements">
          <Card>
            <CardHeader>
              <CardTitle>Mouvements de stock</CardTitle>
            </CardHeader>
            <CardContent>
              <WarehouseMovementsTable movements={movements} isLoading={movementsLoading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Commandes d'achat</CardTitle>
            </CardHeader>
            <CardContent>
              <WarehouseOrdersTable
                organizationId={organizationId}
                warehouseId={warehouseId}
                orders={purchaseOrders}
                isLoading={ordersLoading}
                onMarkAsReceived={(orderId) => markAsReceivedMutation.mutate(orderId)}
                isMarkingReceived={markAsReceivedMutation.isPending}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <StockAdjustmentDialog open={dialogs.adjustmentDialogOpen} onOpenChange={dialogs.setAdjustmentDialogOpen} organizationId={organizationId} warehouseId={warehouseId} />
      <CreatePurchaseOrderDialog open={dialogs.orderDialogOpen} onOpenChange={dialogs.setOrderDialogOpen} organizationId={organizationId} warehouseId={warehouseId} />
      <StockTransferDialog open={dialogs.transferDialogOpen} onOpenChange={dialogs.setTransferDialogOpen} organizationId={organizationId} fromWarehouseId={warehouseId} fromWarehouseName={warehouse.name} stock={stock || []} />
      <StoreTransferDialog open={dialogs.storeTransferDialogOpen} onOpenChange={dialogs.setStoreTransferDialogOpen} organizationId={organizationId} warehouseId={warehouseId} warehouseName={warehouse.name} stock={stock || []} />
      <DeleteWarehouseDialog open={dialogs.deleteDialogOpen} onOpenChange={dialogs.setDeleteDialogOpen} warehouseId={warehouseId} warehouseName={warehouse.name} organizationId={organizationId} onSuccess={() => router.push(`/preferences/organizations/${organizationId}/warehouses`)} />
      <RestockDialog open={dialogs.restockDialogOpen} onOpenChange={dialogs.setRestockDialogOpen} organizationId={organizationId} warehouseId={warehouseId} />
    </div>
  );
}
