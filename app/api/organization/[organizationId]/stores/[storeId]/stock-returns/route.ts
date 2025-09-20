import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stockReturnCreateSchema } from "@/schema/stock-return.schema";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ organizationId: string; storeId: string }> }
) {
  const { organizationId, storeId } = await params;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const returnedById = searchParams.get("returnedById");

  try {
    const where = {
      storeId,
      store: { organizationId },
      ...(status && { status }),
      ...(returnedById && { returnedById })
    };

    const returns = await prisma.stockReturn.findMany({
      where,
      include: {
        employee: { select: { id: true, email: true, firstName: true, lastName: true } },
        product: { select: { id: true, name: true, sku: true } },
        customer: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(returns);
  } catch (error) {
    console.error("Erreur GET stock-returns:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ organizationId: string; storeId: string }> }
) {
  const { organizationId, storeId } = await params;

  try {
    const body = await req.json();
    const parsed = stockReturnCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    // Vérifier que la boutique appartient à l'organisation
    const store = await prisma.store.findFirst({
      where: { id: storeId, organizationId }
    });

    if (!store) {
      return NextResponse.json({ error: "Boutique non trouvée" }, { status: 404 });
    }

    const stockReturn = await prisma.stockReturn.create({
      data: {
        ...parsed.data,
        organizationId,
        status: "RECEIVED"
      },
      include: {
        employee: { select: { id: true, email: true, firstName: true, lastName: true } },
        product: { select: { id: true, name: true, sku: true } },
        customer: { select: { id: true, name: true, email: true } }
      }
    });

    return NextResponse.json(stockReturn, { status: 201 });
  } catch (error) {
    console.error("Erreur POST stock-returns:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}