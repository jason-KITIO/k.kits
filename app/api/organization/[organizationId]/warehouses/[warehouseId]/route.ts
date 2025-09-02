import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { warehouseUpdateSchema } from "@/schema/warehouse.schema";

export const PUT = withPermission(PERMISSIONS.ORG_SETTINGS)(
  async (
    req: NextRequest,
    {
      params,
    }: { params: Promise<{ organizationId: string; warehouseId: string }> }
  ) => {
    const { organizationId, warehouseId } = await params;

    try {
      const json = await req.json();
      const data = warehouseUpdateSchema.parse(json);

      const updateResult = await prisma.warehouse.updateMany({
        where: { id: warehouseId, organizationId },
        data,
      });

      if (updateResult.count === 0) {
        return NextResponse.json(
          { error: "Entrepôt introuvable ou accès refusé" },
          { status: 404 }
        );
      }

      return NextResponse.json({ message: "Entrepôt mis à jour" });
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      return NextResponse.json({ error: "Erreur inconnue" }, { status: 400 });
    }
  }
);

export const DELETE = withPermission(PERMISSIONS.ORG_SETTINGS)(
  async (
    _req: NextRequest,
    {
      params,
    }: { params: Promise<{ organizationId: string; warehouseId: string }> }
  ) => {
    const { organizationId, warehouseId } = await params;

    const deleteResult = await prisma.warehouse.deleteMany({
      where: { id: warehouseId, organizationId },
    });

    if (deleteResult.count === 0) {
      return NextResponse.json(
        { error: "Entrepôt introuvable ou accès refusé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Entrepôt supprimé" });
  }
);
