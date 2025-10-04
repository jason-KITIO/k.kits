import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";

// GET - Lire les alertes de stock
export const GET = withPermission(PERMISSIONS.STOCK_READ)(
  async (req: NextRequest, { params }: any) => {
    const { organizationId } = await params;

    try {
      const stocks = await prisma.stock.findMany({
        where: {
          OR: [
            { store: { organizationId } },
            { warehouse: { organizationId } },
          ],
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              minStock: true,
              unitPrice: true,
            },
          },
          store: {
            select: {
              id: true,
              name: true,
            },
          },
          warehouse: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Filtrer les stocks avec alertes et calculer l'urgence
      const alerts = stocks
        .filter((stock) => stock.quantity <= stock.product.minStock)
        .map((stock) => {
          const percentageLeft = (stock.quantity / stock.product.minStock) * 100;
          let urgency: "CRITICAL" | "HIGH" | "MEDIUM";
          
          if (stock.quantity === 0) {
            urgency = "CRITICAL";
          } else if (percentageLeft <= 25) {
            urgency = "HIGH";
          } else {
            urgency = "MEDIUM";
          }

          return {
            id: stock.id,
            quantity: stock.quantity,
            percentageLeft,
            urgency,
            product: stock.product,
            store: stock.store,
            warehouse: stock.warehouse,
          };
        })
        .sort((a, b) => {
          // Trier par urgence puis par pourcentage
          const urgencyOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2 };
          if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
            return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
          }
          return a.percentageLeft - b.percentageLeft;
        });

      return NextResponse.json(alerts);
    } catch (error) {
      console.error("Erreur GET stock-alerts", error);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }
);