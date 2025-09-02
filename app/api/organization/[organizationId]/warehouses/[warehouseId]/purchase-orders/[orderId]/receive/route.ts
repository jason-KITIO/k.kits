import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import prisma from "@/lib/prisma"
import { z } from "zod";
import { receiveOrderSchema } from "@/schema/purchase-order.schema";


export const POST = withPermission(PERMISSIONS.PURCHASE_ORDER_UPDATE)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string; warehouseId: string; orderId: string }> }
  ) => {
    const { organizationId, warehouseId, orderId } = await params;

    try {
      const json = await req.json();
      const data = receiveOrderSchema.parse(json);

      const result = await prisma.$transaction(async (tx) => {
        const order = await tx.purchaseOrder.findFirst({
          where: { id: orderId, organizationId, warehouseId },
          include: { items: true },
        });

        if (!order) {
          throw new Error("Commande introuvable");
        }

        for (const reception of data.items) {
          const orderItem = order.items.find(item => item.id === reception.purchaseOrderItemId);
          if (!orderItem) continue;

          await tx.purchaseOrderItem.update({
            where: { id: reception.purchaseOrderItemId },
            data: {
              receivedQuantity: { increment: reception.receivedQuantity },
            },
          });

          await tx.stockMovement.create({
            data: {
              productId: orderItem.productId,
              toWarehouseId: warehouseId,
              quantity: reception.receivedQuantity,
              type: "PURCHASE",
              reference: orderId,
              reason: `Réception commande ${orderId}`,
              userId: req.headers.get("user-id") || "",
              organizationId,
            },
          });

          await tx.stock.upsert({
            where: {
              productId_warehouseId_storeId_organizationId: {
                productId: orderItem.productId,
                warehouseId,
                storeId: "null",
                organizationId,
              },
            },
            update: {
              quantity: { increment: reception.receivedQuantity },
              lastUpdated: new Date(),
            },
            create: {
              productId: orderItem.productId,
              warehouseId,
              quantity: reception.receivedQuantity,
              organizationId,
            },
          });
        }

        const updatedOrder = await tx.purchaseOrder.findFirst({
          where: { id: orderId },
          include: { items: true },
        });

        const allReceived = updatedOrder?.items.every(
          item => item.receivedQuantity >= item.quantity
        );

        if (allReceived) {
          await tx.purchaseOrder.update({
            where: { id: orderId },
            data: { status: "RECEIVED" },
          });
        }

        return updatedOrder;
      });

      return NextResponse.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error }, { status: 400 });
      }
      return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
  }
);