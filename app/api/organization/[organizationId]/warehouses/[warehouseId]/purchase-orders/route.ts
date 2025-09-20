import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { purchaseOrderCreateSchema } from "@/schema/purchase-order.schema";
import { getUserFromCookie } from "@/lib/get-user-from-cookie";

export const GET = withPermission(PERMISSIONS.PURCHASE_ORDER_READ)(
  async (
    req: NextRequest,
    {
      params,
    }: { params: Promise<{ organizationId: string; warehouseId: string }> }
  ) => {
    const { organizationId, warehouseId } = await params;

    const orders = await prisma.purchaseOrder.findMany({
      where: { organizationId, warehouseId },
      include: {
        supplier: true,
        user: { select: { firstName: true, lastName: true } },
        items: { include: { product: true } },
      }, // Correction de l'erreur de typage : tri par 'id' au lieu de 'createdAt' // Si 'createdAt' est un champ valide, veuillez exécuter 'npx prisma generate'
      orderBy: { id: "desc" },
    });

    return NextResponse.json(orders);
  }
);

export const POST = withPermission(PERMISSIONS.PURCHASE_ORDER_CREATE)(
  async (
    req: NextRequest,
    {
      params,
    }: { params: Promise<{ organizationId: string; warehouseId: string }> }
  ) => {
    const { organizationId, warehouseId } = await params;

    try {
      const json = await req.json();
      const data = purchaseOrderCreateSchema.parse(json);

      const result = await prisma.$transaction(async (tx) => {
        const totalAmount = data.items.reduce((sum, item) => {
          return sum + item.quantity * item.unitPrice;
        }, 0);

        const user = await getUserFromCookie();
        if (!user) {
          throw new Error("Utilisateur non authentifié");
        }

        const order = await tx.purchaseOrder.create({
          data: {
            supplierId: data.supplierId,
            warehouseId,
            expectedDate: data.expectedDate
              ? new Date(data.expectedDate)
              : null,
            status: data.status,
            totalAmount,
            userId: user,
            organizationId,
          },
        });

        for (const item of data.items) {
          await tx.purchaseOrderItem.create({
            data: {
              purchaseOrderId: order.id,
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalAmount: item.quantity * item.unitPrice,
            },
          });
        }

        return order;
      });

      return NextResponse.json(result, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error }, { status: 400 });
      }
      return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
  }
);
