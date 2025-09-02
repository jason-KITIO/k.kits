import { stockUpdateSchema } from "@/schema/stock.schema";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      organizationId: string;
      storeId: string;
      stockId: string;
    }>;
  }
) {
  try {
    const { organizationId, storeId, stockId } = await params;

    const store = await prisma.store.findFirst({
      where: { id: storeId, organizationId, active: true },
    });
    if (!store)
      return NextResponse.json(
        { error: "Boutique introuvable" },
        { status: 404 }
      );

    const stock = await prisma.stock.findFirst({
      where: { id: stockId, storeId, organizationId },
      include: { product: true, warehouse: true },
    });
    if (!stock)
      return NextResponse.json({ error: "Stock introuvable" }, { status: 404 });

    return NextResponse.json(stock);
  } catch (error) {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      organizationId: string;
      storeId: string;
      stockId: string;
    }>;
  }
) {
  try {
    const { organizationId, storeId, stockId } = await params;

    const store = await prisma.store.findFirst({
      where: { id: storeId, organizationId, active: true },
    });
    if (!store)
      return NextResponse.json(
        { error: "Boutique introuvable" },
        { status: 404 }
      );

    const jsonData = await req.json();
    const data = stockUpdateSchema.parse(jsonData);

    const updateResult = await prisma.stock.updateMany({
      where: { id: stockId, storeId, organizationId },
      data: {
        ...data,
        lastUpdated: new Date(),
      },
    });

    if (updateResult.count === 0)
      return NextResponse.json(
        { error: "Stock introuvable ou accès refusé" },
        { status: 404 }
      );

    return NextResponse.json({ message: "Stock mis à jour" });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error }, { status: 400 });
    }
    return NextResponse.json(
      { error: error.message || "Erreur interne" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      organizationId: string;
      storeId: string;
      stockId: string;
    }>;
  }
) {
  try {
    const { organizationId, storeId, stockId } = await params;

    const store = await prisma.store.findFirst({
      where: { id: storeId, organizationId, active: true },
    });
    if (!store)
      return NextResponse.json(
        { error: "Boutique introuvable" },
        { status: 404 }
      );

    const deleteResult = await prisma.stock.deleteMany({
      where: { id: stockId, storeId, organizationId },
    });
    if (deleteResult.count === 0)
      return NextResponse.json(
        { error: "Stock introuvable ou accès refusé" },
        { status: 404 }
      );

    return NextResponse.json({ message: "Stock supprimé" });
  } catch (error) {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
