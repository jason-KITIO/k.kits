import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import { warehouseCreateSchema } from "@/schema/warehouse.schema";
import prisma from "@/lib/prisma";

export const GET = withPermission(PERMISSIONS.ORG_SETTINGS)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string }> }
  ) => {
    const { organizationId } = await params;

    const warehouses = await prisma.warehouse.findMany({
      where: { organizationId, active: true },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(warehouses);
  }
);

export const POST = withPermission(PERMISSIONS.ORG_SETTINGS)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string }> }
  ) => {
    const { organizationId } = await params;

    try {
      const json = await req.json();
      const data = warehouseCreateSchema.parse(json);

      const warehouse = await prisma.warehouse.create({
        data: {
          ...data,
          organizationId,
          active: data.active ?? true,
        },
      });

      return NextResponse.json(warehouse, { status: 201 });
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      return NextResponse.json({ error: "Erreur inconnue" }, { status: 400 });
    }
  }
);
