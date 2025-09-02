import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import prisma from "@/lib/prisma"


export const GET = withPermission(PERMISSIONS.STOCK_READ)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string }> }
  ) => {
    const { organizationId } = await params;

    const lowStockProducts = await prisma.stock.findMany({
      where: {
        organizationId,
        quantity: {
          lte: prisma.product.fields.minStock,
        },
      },
      include: {
        product: {
          select: {
            name: true,
            sku: true,
            minStock: true,
            unitPrice: true,
          },
        },
        store: { select: { name: true } },
        warehouse: { select: { name: true } },
      },
      orderBy: [
        { quantity: "asc" },
        { lastUpdated: "desc" },
      ],
    });

    // Calculer le niveau d'urgence
    const alerts = lowStockProducts.map((stock) => ({
      ...stock,
      urgency: stock.quantity === 0 ? "CRITICAL" : 
               stock.quantity <= stock.product.minStock * 0.2 ? "HIGH" : "MEDIUM",
      percentageLeft: stock.product.minStock > 0 ? 
                     (stock.quantity / stock.product.minStock) * 100 : 0,
    }));

    return NextResponse.json(alerts);
  }
);