"use client";

import { OrderInfoCards } from "@/components/purchase-orders/order-info-cards";
import { OrderItemsTable } from "@/components/purchase-orders/order-items-table";
import { PurchaseOrderHeader } from "@/components/pages/purchase-order-header";
import { usePurchaseOrderDetail } from "@/hooks/pages/use-purchase-order-detail";

export default function PurchaseOrderDetailPage() {
  const {
    organizationId,
    warehouseId,
    order,
    isLoading,
    formatCurrency,
    markAsReceived,
    isMarkingAsReceived,
  } = usePurchaseOrderDetail();

  if (isLoading) return <div className="p-6">Chargement...</div>;
  if (!order) return <div className="p-6">Commande non trouvée</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        <PurchaseOrderHeader
          organizationId={organizationId}
          warehouseId={warehouseId}
          order={order}
          formatCurrency={formatCurrency}
          onMarkAsReceived={markAsReceived}
          isMarkingAsReceived={isMarkingAsReceived}
        />

        <OrderInfoCards
          supplier={order.supplier}
          warehouse={order.warehouse}
          expectedDate={order.expectedDate}
          user={order.user}
        />

        <OrderItemsTable
          items={order.items}
          totalAmount={order.totalAmount}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
}