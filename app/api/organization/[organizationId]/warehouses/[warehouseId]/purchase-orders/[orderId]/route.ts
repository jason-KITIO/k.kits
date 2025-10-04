import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import prisma from "@/lib/prisma";

export const GET = withPermission(PERMISSIONS.PURCHASE_ORDER_READ)(
  async (
    req: NextRequest,
    {
      params,
    }: { params: Promise<{ organizationId: string; warehouseId: string; orderId: string }> }
  ) => {
    const { organizationId, warehouseId, orderId } = await params;

    const order = await prisma.purchaseOrder.findFirst({
      where: { 
        id: orderId,
        organizationId, 
        warehouseId 
      },
      include: {
        supplier: true,
        user: { select: { firstName: true, lastName: true } },
        warehouse: { select: { name: true, address: true } },
        items: { 
          include: { 
            product: { select: { name: true, sku: true } } 
          } 
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 });
    }

    return NextResponse.json(order);
  }
);