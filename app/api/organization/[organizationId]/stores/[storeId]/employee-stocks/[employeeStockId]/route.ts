import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { employeeStockUpdateSchema } from "@/schema/employee-stock.schema";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ organizationId: string; storeId: string; employeeStockId: string }> }
) {
  const { organizationId, storeId, employeeStockId } = await params;

  try {
    const employeeStock = await prisma.employeeStock.findFirst({
      where: {
        id: employeeStockId,
        storeId,
        store: { organizationId }
      },
      include: {
        employee: { select: { id: true, email: true } },
        product: { select: { id: true, name: true, sku: true } },
        store: { select: { id: true, name: true } }
      }
    });

    if (!employeeStock) {
      return NextResponse.json({ error: "Stock employé non trouvé" }, { status: 404 });
    }

    return NextResponse.json(employeeStock);
  } catch (error) {
    console.error("Erreur GET employee-stock:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ organizationId: string; storeId: string; employeeStockId: string }> }
) {
  const { organizationId, storeId, employeeStockId } = await params;

  try {
    const body = await req.json();
    const parsed = employeeStockUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    const updatedStock = await prisma.employeeStock.update({
      where: {
        id: employeeStockId,
        storeId,
        store: { organizationId }
      },
      data: parsed.data,
      include: {
        employee: { select: { id: true, email: true } },
        product: { select: { id: true, name: true, sku: true } },
        store: { select: { id: true, name: true } }
      }
    });

    return NextResponse.json(updatedStock);
  } catch (error) {
    console.error("Erreur PUT employee-stock:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ organizationId: string; storeId: string; employeeStockId: string }> }
) {
  const { organizationId, storeId, employeeStockId } = await params;

  try {
    await prisma.employeeStock.delete({
      where: {
        id: employeeStockId,
        storeId,
        store: { organizationId }
      }
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Erreur DELETE employee-stock:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}