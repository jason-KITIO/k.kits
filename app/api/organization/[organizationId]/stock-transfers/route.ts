import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import prisma from "@/lib/prisma"

import { z } from "zod";
import { stockTransferCreateSchema } from "@/schema/stock-transfer.schema";


export const GET = withPermission(PERMISSIONS.STOCK_READ)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string }> }
  ) => {
    const { organizationId } = await params;

    const transfers = await prisma.stockMovement.findMany({
      where: {
        organizationId,
        type: "TRANSFER",
      },
      include: {
        product: { select: { name: true, sku: true } },
        user: { select: { firstName: true, lastName: true } },
        fromStore: { select: { name: true } },
        toStore: { select: { name: true } },
        fromWarehouse: { select: { name: true } },
        toWarehouse: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(transfers);
  }
);

export const POST = withPermission(PERMISSIONS.STOCK_TRANSFER)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string }> }
  ) => {
    const { organizationId } = await params;

    try {
      const json = await req.json();
      const data = stockTransferCreateSchema.parse(json);

      const result = await prisma.$transaction(async (tx) => {
        // Vérifier stock source
        const sourceStock = await tx.stock.findFirst({
          where: {
            productId: data.productId,
            warehouseId: data.fromWarehouseId || null,
            storeId: data.fromStoreId || null,
            organizationId,
          },
        });

        if (!sourceStock || sourceStock.quantity < data.quantity) {
          throw new Error("Stock insuffisant");
        }

        // Créer mouvement OUT (source)
        const outMovement = await tx.stockMovement.create({
          data: {
            productId: data.productId,
            fromWarehouseId: data.fromWarehouseId,
            fromStoreId: data.fromStoreId,
            quantity: data.quantity,
            type: "TRANSFER",
            reason: data.reason || "Transfert de stock",
            userId: req.headers.get("user-id") || "",
            organizationId,
          },
        });

        // Créer mouvement IN (destination)
        await tx.stockMovement.create({
          data: {
            productId: data.productId,
            toWarehouseId: data.toWarehouseId,
            toStoreId: data.toStoreId,
            quantity: data.quantity,
            type: "TRANSFER",
            reference: outMovement.id,
            reason: data.reason || "Transfert de stock",
            userId: req.headers.get("user-id") || "",
            organizationId,
          },
        });

        // Décrémenter stock source
        await tx.stock.update({
          where: { id: sourceStock.id },
          data: {
            quantity: { decrement: data.quantity },
            lastUpdated: new Date(),
          },
        });

        // Incrémenter stock destination
        await tx.stock.upsert({
          where: {
            productId_warehouseId_storeId_organizationId: {
              productId: data.productId,
              warehouseId: data.toWarehouseId || "",
              storeId: data.toStoreId || "",
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
            storeId: data.toStoreId || null,
            quantity: data.quantity,
            organizationId,
          },
        });

        return outMovement;
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