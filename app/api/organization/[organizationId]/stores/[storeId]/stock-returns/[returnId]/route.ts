import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stockReturnUpdateSchema } from "@/schema/stock-return.schema";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ organizationId: string; storeId: string; returnId: string }> }
) {
  const { organizationId, storeId, returnId } = await params;

  try {
    const stockReturn = await prisma.stockReturn.findFirst({
      where: {
        id: returnId,
        organizationId
      },
      include: {
        employee: { select: { id: true, email: true, firstName: true, lastName: true } },
        product: { select: { id: true, name: true, sku: true } },
        customer: { select: { id: true, name: true, email: true } }
      }
    });

    if (!stockReturn) {
      return NextResponse.json({ error: "Retour non trouvé" }, { status: 404 });
    }

    return NextResponse.json(stockReturn);
  } catch (error) {
    console.error("Erreur GET stock-return:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ organizationId: string; storeId: string; returnId: string }> }
) {
  const { organizationId, storeId, returnId } = await params;

  try {
    const body = await req.json();
    const parsed = stockReturnUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    const updatedReturn = await prisma.stockReturn.update({
      where: {
        id: returnId
      },
      data: parsed.data,
      include: {
        employee: { select: { id: true, email: true, firstName: true, lastName: true } },
        product: { select: { id: true, name: true, sku: true } },
        customer: { select: { id: true, name: true, email: true } }
      }
    });

    return NextResponse.json(updatedReturn);
  } catch (error) {
    console.error("Erreur PUT stock-return:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ organizationId: string; storeId: string; returnId: string }> }
) {
  const { organizationId, storeId, returnId } = await params;

  try {
    await prisma.stockReturn.delete({
      where: {
        id: returnId
      }
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Erreur DELETE stock-return:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}