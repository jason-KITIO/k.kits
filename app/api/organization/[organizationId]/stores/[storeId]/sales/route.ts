import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import prisma from "@/lib/prisma"
import { z } from "zod";
import { saleCreateSchema } from "@/schema/sale.schema";


export const GET = withPermission(PERMISSIONS.SALE_READ)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string; storeId: string }> }
  ) => {
    const { organizationId, storeId } = await params;

    const sales = await prisma.sale.findMany({
      where: { organizationId, storeId },
      include: {
        customer: true,
        user: { select: { firstName: true, lastName: true } },
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(sales);
  }
);

export const POST = withPermission(PERMISSIONS.SALE_CREATE)(
  async (
    req: NextRequest,
    { params, user }: { params: Promise<{ organizationId: string; storeId: string }>; user: any }
  ) => {
    const { organizationId, storeId } = await params;

    try {
      const json = await req.json();
      const data = saleCreateSchema.parse(json);

      // Vérifier le stock disponible avant de créer la vente
      const stockItems = await prisma.stock.findMany({
        where: {
          storeId,
          productId: { in: data.items.map(item => item.productId) },
          organizationId,
        },
      });

      for (const item of data.items) {
        const stockItem = stockItems.find(s => s.productId === item.productId);
        if (!stockItem || stockItem.quantity < item.quantity) {
          const product = await prisma.product.findUnique({
            where: { id: item.productId },
            select: { name: true, sku: true }
          });
          return NextResponse.json(
            { 
              error: `Stock insuffisant pour le produit ${product?.name || item.productId}`,
              details: {
                productId: item.productId,
                productName: product?.name,
                sku: product?.sku,
                requested: item.quantity,
                available: stockItem?.quantity || 0
              }
            },
            { status: 400 }
          );
        }
      }

      const result = await prisma.$transaction(async (tx) => {
        // Calculer le montant total
        const totalAmount = data.items.reduce((sum, item) => {
          const itemTotal = item.quantity * item.unitPrice * (1 - item.discount / 100);
          return sum + itemTotal;
        }, 0);

        // Créer la vente
        const sale = await tx.sale.create({
          data: {
            customerId: data.customerId || null,
            storeId,
            totalAmount,
            paidAmount: data.paidAmount,
            status: data.status,
            dueDate: data.dueDate ? new Date(data.dueDate) : null,
            userId: user.id,
            organizationId,
          },
        });

        // Créer les lignes de vente et mouvements de stock
        for (const item of data.items) {
          const itemTotal = item.quantity * item.unitPrice * (1 - item.discount / 100);
          
          await tx.saleItem.create({
            data: {
              saleId: sale.id,
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              discount: item.discount,
              totalAmount: itemTotal,
            },
          });

          // Mouvement de stock OUT
          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              fromStoreId: storeId,
              quantity: item.quantity,
              type: "SALE",
              reference: sale.id,
              userId: user.id,
              organizationId,
            },
          });

          // Décrémenter le stock
          await tx.stock.updateMany({
            where: {
              productId: item.productId,
              storeId,
              organizationId,
            },
            data: {
              quantity: { decrement: item.quantity },
              lastUpdated: new Date(),
            },
          });
        }

        return sale;
      });

      return NextResponse.json(result, { status: 201 });
    } catch (error) {
      console.error("Erreur création vente:", error);
      if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error.issues }, { status: 400 });
      }
      return NextResponse.json({ 
        error: "Erreur interne", 
        details: error instanceof Error ? error.message : String(error) 
      }, { status: 500 });
    }
  }
);