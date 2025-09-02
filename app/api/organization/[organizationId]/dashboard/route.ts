import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import prisma from "@/lib/prisma"

export const GET = withPermission(PERMISSIONS.DASHBOARD_READ)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string }> }
  ) => {
    const { organizationId } = await params;

    try {
      const [
        totalProducts,
        totalStores,
        totalWarehouses,
        lowStockProductsQueryResult, // Nom mis à jour pour plus de clarté
        todaySales,
        pendingOrders,
        totalStockValue,
        recentMovements,
      ] = await Promise.all([
        // Total produits
        prisma.product.count({
          where: { organizationId, active: true },
        }),

        // Total boutiques
        prisma.store.count({
          where: { organizationId, active: true },
        }),

        // Total entrepôts
        prisma.warehouse.count({
          where: { organizationId, active: true },
        }),

        // Produits en stock bas (requête SQL brute pour plus de performance)
        prisma.$queryRaw`
          SELECT COUNT(DISTINCT "T1".id) AS count
          FROM "Product" AS "T1"
          JOIN "Stock" AS "T2" ON "T1".id = "T2"."productId"
          WHERE "T1"."organizationId" = ${organizationId}
          GROUP BY "T1".id, "T1"."minStock"
          HAVING SUM("T2".quantity) <= "T1"."minStock";
        `,

        // Ventes du jour
        prisma.sale.aggregate({
          where: {
            organizationId,
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
          _sum: { totalAmount: true },
          _count: true,
        }),

        // Commandes en attente
        prisma.purchaseOrder.count({
          where: {
            organizationId,
            status: { in: ["PENDING", "CONFIRMED", "SHIPPED"] },
          },
        }),

        // Valeur totale du stock
        prisma.$queryRaw`
          SELECT SUM(s.quantity * p."costPrice") as total_value
          FROM "Stock" s
          JOIN "Product" p ON s."productId" = p.id
          WHERE s."organizationId" = ${organizationId}
        `,

        // Mouvements récents
        prisma.stockMovement.findMany({
          where: { organizationId },
          include: {
            product: { select: { name: true } },
            user: { select: { firstName: true, lastName: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
      ]);

      // Extraire le résultat de la requête raw
      const lowStockCount = Array.isArray(lowStockProductsQueryResult)
        ? lowStockProductsQueryResult[0]?.count || 0
        : 0;

      const dashboard = {
        overview: {
          totalProducts,
          totalStores,
          totalWarehouses,
          lowStockProducts: lowStockCount,
        },
        sales: {
          todayAmount: todaySales._sum.totalAmount || 0,
          todayCount: todaySales._count,
        },
        orders: {
          pending: pendingOrders,
        },
        stock: {
          totalValue: Array.isArray(totalStockValue)
            ? totalStockValue[0]?.total_value || 0
            : 0,
          lowStockAlert: lowStockCount,
        },
        recentActivity: recentMovements,
      };

      return NextResponse.json(dashboard);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
  }
);
