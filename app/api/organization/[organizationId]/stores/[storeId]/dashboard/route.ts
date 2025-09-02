import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import prisma from "@/lib/prisma";

export const GET = withPermission(PERMISSIONS.DASHBOARD_READ)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string; storeId: string }> }
  ) => {
    const { organizationId, storeId } = await params;

    try {
      const [
        todaySales,
        totalProducts,
        allStocks, // Changement : On récupère toutes les données de stock
        totalStockValue,
        recentSales,
        topProducts,
      ] = await Promise.all([
        // Ventes du jour
        prisma.sale.aggregate({
          where: {
            storeId,
            organizationId,
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
          _sum: { totalAmount: true },
          _count: true,
        }), // Total produits en stock

        prisma.stock.count({
          where: { storeId, organizationId, quantity: { gt: 0 } },
        }), // Changement : On récupère tous les stocks avec la valeur minStock du produit

        prisma.stock.findMany({
          where: { storeId, organizationId },
          include: { product: { select: { minStock: true } } },
        }), // Valeur totale du stock

        prisma.$queryRaw`
          SELECT SUM(s.quantity * p."costPrice") as total_value
          FROM stocks s
          JOIN products p ON s."productId" = p.id
          WHERE s."storeId" = ${storeId} AND s."organizationId" = ${organizationId}
        `, // Ventes récentes

        prisma.sale.findMany({
          where: { storeId, organizationId },
          include: {
            customer: { select: { name: true } },
            items: { include: { product: { select: { name: true } } } },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        }), // Produits les plus vendus

        prisma.$queryRaw`
          SELECT p.name, SUM(si.quantity) as total_sold
          FROM sale_items si
          JOIN products p ON si."productId" = p.id
          JOIN sales s ON si."saleId" = s.id
          WHERE s."storeId" = ${storeId} AND s."organizationId" = ${organizationId}
          GROUP BY p.id, p.name
          ORDER BY total_sold DESC
          LIMIT 5
        `,
      ]);

      // Nouvelle étape : Calculer le nombre de produits en stock bas
      const lowStockCount = allStocks.filter(
        (stock) => stock.quantity <= stock.product.minStock
      ).length;

      const dashboard = {
        sales: {
          todayAmount: todaySales._sum.totalAmount || 0,
          todayCount: todaySales._count,
        },
        inventory: {
          totalProducts,
          lowStockCount,
          totalValue: Array.isArray(totalStockValue)
            ? totalStockValue[0]?.total_value || 0
            : 0,
        },
        recentActivity: {
          recentSales,
          topProducts,
        },
      };

      return NextResponse.json(dashboard);
    } catch (error) {
      return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
  }
);
