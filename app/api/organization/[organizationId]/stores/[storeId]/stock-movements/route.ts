import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import prisma from "@/lib/prisma"
import { z } from "zod";
import { stockMovementCreateSchema } from "@/schema/stock-movement.schema";

// GET - Historique des mouvements de stock
export const GET = withPermission(PERMISSIONS.STOCK_READ)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string; storeId: string }> }
  ) => {
    const { organizationId, storeId } = await params;

    const store = await prisma.store.findFirst({
      where: { id: storeId, organizationId, active: true },
    });

    if (!store) {
      return NextResponse.json(
        { error: "Boutique introuvable" },
        { status: 404 }
      );
    }

    const movements = await prisma.stockMovement.findMany({
      where: {
        organizationId,
        OR: [{ fromStoreId: storeId }, { toStoreId: storeId }],
      },
      include: {
        product: true,
        user: { select: { firstName: true, lastName: true } },
        fromStore: { select: { name: true } },
        toStore: { select: { name: true } },
        fromWarehouse: { select: { name: true } },
        toWarehouse: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(movements);
  }
);

// POST - Créer un mouvement de stock
export const POST = withPermission(PERMISSIONS.STOCK_CREATE)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string; storeId: string }> }
  ) => {
    const { organizationId, storeId } = await params;

    const store = await prisma.store.findFirst({
      where: { id: storeId, organizationId, active: true },
    });

    if (!store) {
      return NextResponse.json(
        { error: "Boutique introuvable" },
        { status: 404 }
      );
    }

    try {
      const json = await req.json();
      const data = stockMovementCreateSchema.parse(json);

      const result = await prisma.$transaction(async (tx) => {
        // Créer le mouvement
        const movement = await tx.stockMovement.create({
          data: {
            ...data,
            organizationId,
            userId: req.headers.get("user-id") || "", // À adapter selon votre auth
          },
        });

        // Mettre à jour le stock selon le type de mouvement
        if (data.type === "IN" || data.type === "ADJUSTMENT") {
          await tx.stock.upsert({
            where: {
              productId_warehouseId_storeId_organizationId: {
                productId: data.productId,
                warehouseId: data.toWarehouseId || null,
                storeId: data.toStoreId || storeId,
                organizationId,
              },
            },
            update: {
              quantity: { increment: data.quantity },
              lastUpdated: new Date(),
            },
            create: {
              productId: data.productId,
              warehouseId: data.toWarehouseId || null,
              storeId: data.toStoreId || storeId,
              quantity: data.quantity,
              organizationId,
            },
          });
        }

        if (data.type === "OUT") {
          await tx.stock.update({
            where: {
              productId_warehouseId_storeId_organizationId: {
                productId: data.productId,
                warehouseId: data.fromWarehouseId || null,
                storeId: data.fromStoreId || storeId,
                organizationId,
              },
            },
            data: {
              quantity: { decrement: data.quantity },
              lastUpdated: new Date(),
            },
          });
        }

        return movement;
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