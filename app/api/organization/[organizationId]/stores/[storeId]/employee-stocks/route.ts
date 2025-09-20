import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { employeeStockCreateSchema, employeeStockUpdateSchema } from "@/schema/employee-stock.schema";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ organizationId: string; storeId: string }> }
) {
  const { organizationId, storeId } = await params;
  const { searchParams } = new URL(req.url);
  const employeeId = searchParams.get("employeeId");

  try {
    const where = {
      storeId,
      store: { organizationId },
      ...(employeeId && { employeeId })
    };

    const employeeStocks = await prisma.employeeStock.findMany({
      where,
      include: {
        employee: { select: { id: true, email: true } },
        product: { select: { id: true, name: true, sku: true } },
        store: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(employeeStocks);
  } catch (error) {
    console.error("Erreur GET employee-stocks:", error);
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
    const parsed = employeeStockCreateSchema.safeParse(body);

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

    const employeeStock = await prisma.employeeStock.create({
      data: {
        ...parsed.data,
        storeId,
        organizationId
      },
      include: {
        employee: { select: { id: true, email: true } },
        product: { select: { id: true, name: true, sku: true } },
        store: { select: { id: true, name: true } }
      }
    });

    return NextResponse.json(employeeStock, { status: 201 });
  } catch (error) {
    console.error("Erreur POST employee-stocks:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}