import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import prisma from "@/lib/prisma"
import { z } from "zod";
import { purchaseOrderUpdateSchema } from "@/schema/purchase-order.schema";


export const GET = withPermission(PERMISSIONS.PURCHASE_ORDER_READ)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string; warehouseId: string; orderId: string }> }
  ) => {
    const { organizationId, warehouseId, orderId } = await params;

    const order = await prisma.purchaseOrder.findFirst({
      where: { id: orderId, organizationId, warehouseId },
      include: {
        supplier: true,
        warehouse: true,
        user: { select: { firstName: true, lastName: true } },
        items: { include: { product: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
    }

    return NextResponse.json(order);
  }
);

export const PUT = withPermission(PERMISSIONS.PURCHASE_ORDER_UPDATE)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string; warehouseId: string; orderId: string }> }
  ) => {
    const { organizationId, warehouseId, orderId } = await params;

    try {
      const json = await req.json();
      const data = purchaseOrderUpdateSchema.parse(json);

      const order = await prisma.purchaseOrder.update({
        where: { id: orderId },
        data: {
          ...data,
          expectedDate: data.expectedDate ? new Date(data.expectedDate) : undefined,
        },
      });

      return NextResponse.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error }, { status: 400 });
      }
      return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
  }
);