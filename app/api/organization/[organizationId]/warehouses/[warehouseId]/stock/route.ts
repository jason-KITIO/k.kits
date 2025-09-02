import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import prisma from "@/lib/prisma"


export const GET = withPermission(PERMISSIONS.STOCK_READ)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string; warehouseId: string }> }
  ) => {
    const { organizationId, warehouseId } = await params;

    const warehouse = await prisma.warehouse.findFirst({
      where: { id: warehouseId, organizationId, active: true },
    });

    if (!warehouse) {
      return NextResponse.json(
        { error: "Entrepôt introuvable" },
        { status: 404 }
      );
    }

    const stocks = await prisma.stock.findMany({
      where: { warehouseId, organizationId },
      include: { 
        product: {
          include: {
            category: { select: { name: true } },
            supplier: { select: { name: true } },
          }
        }
      },
      orderBy: { lastUpdated: "desc" },
    });

    return NextResponse.json(stocks);
  }
);