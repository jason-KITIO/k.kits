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

        const sessionToken = await getUserFromCookie();
        if (!sessionToken) {
          throw new Error("Utilisateur non authentifié");
        }

        // Récupérer l'utilisateur depuis le token de session
        const session = await tx.userSession.findUnique({
          where: { sessionToken, active: true },
          include: { user: true },
        });

        if (!session || !session.user) {
          throw new Error("Session invalide");
        }

        const order = await tx.purchaseOrder.create({
          data: {
            supplierId: data.supplierId,
            warehouseId,
            orderDate: new Date(),
            expectedDate: data.expectedDate
              ? new Date(data.expectedDate)
              : null,
            status: data.status,
            totalAmount,
            userId: session.user.id,
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
      console.error("Erreur lors de la création de la commande:", error);
      if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error.errors }, { status: 400 });
      }
      return NextResponse.json({ 
        error: "Erreur interne", 
        details: error instanceof Error ? error.message : String(error) 
      }, { status: 500 });
    }
  }
);
