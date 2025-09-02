import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = withPermission(PERMISSIONS.SALE_READ)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string }> }
  ) => {
    const { organizationId } = await params;
    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("storeId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const whereClause: any = { organizationId };
    
    if (storeId) whereClause.storeId = storeId;
    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const sales = await prisma.sale.findMany({
      where: whereClause,
      include: {
        store: { select: { name: true } },
        customer: { select: { name: true } },
        user: { select: { firstName: true, lastName: true } },
        items: {
          include: {
            product: { select: { name: true, sku: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json(sales);
  }
);