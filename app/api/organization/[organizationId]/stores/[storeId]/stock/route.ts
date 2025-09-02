import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server";


export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ organizationId: string; storeId: string }> }
) {
  try {
    const { organizationId, storeId } = await params;
    // Vérifier la boutique et son appartenance à l’organisation
    const store = await prisma.store.findFirst({
      where: { id: storeId, organizationId, active: true },
    });
    if (!store)
      return NextResponse.json(
        { error: "Boutique introuvable" },
        { status: 404 }
      );

    // Récupérer les stocks liés à cette boutique et organisation
    const stocks = await prisma.stock.findMany({
      where: { storeId, organizationId },
      include: { product: true, warehouse: true },
    });

    return NextResponse.json(stocks);
  } catch (error) {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}


