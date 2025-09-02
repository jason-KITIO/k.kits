import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import prisma from "@/lib/prisma"
import { z } from "zod";
import { saleUpdateSchema } from "@/schema/sale.schema";


export const GET = withPermission(PERMISSIONS.SALE_READ)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string; storeId: string; saleId: string }> }
  ) => {
    const { organizationId, storeId, saleId } = await params;

    const sale = await prisma.sale.findFirst({
      where: { id: saleId, organizationId, storeId },
      include: {
        customer: true,
        user: { select: { firstName: true, lastName: true } },
        items: { include: { product: true } },
      },
    });

    if (!sale) {
      return NextResponse.json({ error: "Vente introuvable" }, { status: 404 });
    }

    return NextResponse.json(sale);
  }
);

export const PUT = withPermission(PERMISSIONS.SALE_UPDATE)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string; storeId: string; saleId: string }> }
  ) => {
    const { organizationId, storeId, saleId } = await params;

    try {
      const json = await req.json();
      const data = saleUpdateSchema.parse(json);

      const sale = await prisma.sale.update({
        where: { id: saleId },
        data: {
          ...data,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        },
      });

      return NextResponse.json(sale);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error }, { status: 400 });
      }
      return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
  }
);