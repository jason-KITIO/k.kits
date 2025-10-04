import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import prisma from "@/lib/prisma";

export const GET = withPermission(PERMISSIONS.SALE_READ)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string; storeId: string; saleId: string }> }
  ) => {
    const { organizationId, storeId, saleId } = await params;

    const sale = await prisma.sale.findUnique({
      where: { 
        id: saleId,
        organizationId,
        storeId 
      },
      include: {
        customer: true,
        user: { select: { username: true, firstName: true, lastName: true } },
        store: { select: { name: true } },
        items: { 
          include: { 
            product: { select: { name: true, sku: true } } 
          } 
        },
      },
    });

    if (!sale) {
      return NextResponse.json({ error: "Vente non trouvée" }, { status: 404 });
    }

    return NextResponse.json(sale);
  }
);