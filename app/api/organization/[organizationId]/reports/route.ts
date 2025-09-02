import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import prisma from "@/lib/prisma"

export const GET = withPermission(PERMISSIONS.REPORT_READ)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string }> }
  ) => {
    const { organizationId } = await params;
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    try {
      const dateFilter = startDate && endDate ? {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      } : {};

      switch (type) {
        case "sales":
          const salesReport = await prisma.sale.findMany({
            where: { organizationId, ...dateFilter },
            include: {
              store: { select: { name: true } },
              customer: { select: { name: true } },
              items: { include: { product: { select: { name: true } } } },
            },
            orderBy: { createdAt: "desc" },
          });
          return NextResponse.json(salesReport);

        case "stock":
          const stockReport = await prisma.stock.findMany({
            where: { organizationId },
            include: {
              product: { select: { name: true, minStock: true } },
              store: { select: { name: true } },
              warehouse: { select: { name: true } },
            },
          });
          return NextResponse.json(stockReport);

        case "movements":
          const movementsReport = await prisma.stockMovement.findMany({
            where: { organizationId, ...dateFilter },
            include: {
              product: { select: { name: true } },
              user: { select: { firstName: true, lastName: true } },
              fromStore: { select: { name: true } },
              toStore: { select: { name: true } },
              fromWarehouse: { select: { name: true } },
              toWarehouse: { select: { name: true } },
            },
            orderBy: { createdAt: "desc" },
          });
          return NextResponse.json(movementsReport);

        case "profit":
          const profitReport = await prisma.$queryRaw`
            SELECT 
              p.name as product_name,
              SUM(si.quantity) as total_sold,
              SUM(si."totalAmount") as total_revenue,
              SUM(si.quantity * p."costPrice") as total_cost,
              SUM(si."totalAmount" - (si.quantity * p."costPrice")) as profit
            FROM sale_items si
            JOIN products p ON si."productId" = p.id
            JOIN sales s ON si."saleId" = s.id
            WHERE s."organizationId" = ${organizationId}
            ${startDate && endDate ? `AND s."createdAt" BETWEEN ${startDate} AND ${endDate}` : ''}
            GROUP BY p.id, p.name
            ORDER BY profit DESC
          `;
          return NextResponse.json(profitReport);

        default:
          return NextResponse.json({ error: "Type de rapport non supporté" }, { status: 400 });
      }
    } catch (error) {
      return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
  }
);