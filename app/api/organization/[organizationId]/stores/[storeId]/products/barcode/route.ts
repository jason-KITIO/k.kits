import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = withPermission(PERMISSIONS.PRODUCT_READ)(
  async (
    req: NextRequest,
    { params }: { params: { organizationId: string; storeId: string } }
  ) => {
    const { organizationId, storeId } = params;
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Code-barres requis" },
        { status: 400 }
      );
    }

    try {
      const product = await prisma.product.findFirst({
        where: {
          organizationId,
          active: true,
          sku: code,
          // Optionnellement, vérifier stocks en boutique
          stocks: {
            some: {
              storeId,
              quantity: { gt: 0 }, // produit disponible en stock magasin
            },
          },
        },
        include: {
          category: { select: { name: true } },
          supplier: { select: { name: true } },
          stocks: {
            where: { storeId }, // uniquement stocks boutique courante
            include: {
              store: { select: { name: true } },
              warehouse: { select: { name: true } },
            },
          },
        },
      });

      if (!product) {
        return NextResponse.json(
          { error: "Produit introuvable en boutique" },
          { status: 404 }
        );
      }

      return NextResponse.json(product);
    } catch (error) {
      console.error("Erreur recherche produit code-barres :", error);
      return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
  }
);
