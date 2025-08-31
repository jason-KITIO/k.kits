import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const orgId = request.cookies.get("selected-org-id")?.value;
    if (!orgId)
      return NextResponse.json(
        { message: "Organisation non sélectionnée." },
        { status: 403 }
      );
    checkOrganization(orgId);

    // Récupérer stocks et prix unitaires produits
    const stocks = await prisma.warehouseStock.findMany({
      where: { product: { organizationId: orgId } },
      include: { product: true },
    });

    // Calcul valeur stock par produit
    const valueMap = new Map<
      string,
      { quantity: number; unitPrice: number; totalValue: number }
    >();

    for (const stock of stocks) {
      const qty = stock.quantity;
      const product = stock.product;
      const unitPrice = product.unitPrice ? Number(product.unitPrice) : 0;
      const current = valueMap.get(stock.productId);
      if (current) {
        current.quantity += qty;
        current.totalValue += unitPrice * qty;
      } else {
        valueMap.set(stock.productId, {
          quantity: qty,
          unitPrice,
          totalValue: unitPrice * qty,
        });
      }
    }

    // Résultat par produit
    const results = Array.from(valueMap.entries()).map(([productId, v]) => ({
      productId,
      quantity: v.quantity,
      unitPrice: v.unitPrice.toFixed(2),
      totalValue: v.totalValue.toFixed(2),
    }));

    // Valeur totale globale
    const totalValue = results.reduce(
      (acc, r) => acc + Number(r.totalValue),
      0
    );

    return NextResponse.json({ results, totalValue: totalValue.toFixed(2) });
  } catch (e: unknown) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Erreur serveur." },
      { status: 500 }
    );
  }
}
