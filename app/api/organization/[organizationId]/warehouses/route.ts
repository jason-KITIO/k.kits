import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { warehouseCreateSchema } from "@/schema/warehouse.schema";

export const GET = withPermission(PERMISSIONS.WAREHOUSE_READ)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string }> }
  ) => {
    const { organizationId } = await params;

    const warehouses = await prisma.warehouse.findMany({
      where: { organizationId, active: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(warehouses);
  }
);

export const POST = withPermission(PERMISSIONS.WAREHOUSE_CREATE)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string }> }
  ) => {
    const { organizationId } = await params;
    
    try {
      const body = await req.json();
      const parsed = warehouseCreateSchema.safeParse(body);
      
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
      }
      
      const warehouse = await prisma.warehouse.create({
        data: {
          ...parsed.data,
          organizationId,
        },
      });
      
      return NextResponse.json(warehouse, { status: 201 });
    } catch (error) {
      console.error("Erreur POST warehouse", error);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }
);