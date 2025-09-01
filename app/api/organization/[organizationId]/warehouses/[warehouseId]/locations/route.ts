import { NextRequest, NextResponse } from "next/server";
import { checkOrganization } from "@/helper/check-organization";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ organizationId: string; warehouseId: string }> }
) {
  try {
    const { organizationId, warehouseId } = await params;
    checkOrganization(organizationId);

    // Vérifier que l'entrepôt appartient à l'organisation
    const warehouse = await prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });
    if (!warehouse || warehouse.organizationId !== organizationId) {
      return NextResponse.json(
        { message: "Entrepôt non trouvé dans cette organisation." },
        { status: 404 }
      );
    }

    const locations = await prisma.stockLocation.findMany({
      where: { warehouseId: warehouseId, active: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(locations);
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur lors de la récupération des emplacements." },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ organizationId: string; warehouseId: string }> }
) {
  try {
    const { organizationId, warehouseId } = await params;
    checkOrganization(organizationId);

    const warehouse = await prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });
    if (!warehouse || warehouse.organizationId !== organizationId) {
      return NextResponse.json(
        { message: "Entrepôt non trouvé dans cette organisation." },
        { status: 404 }
      );
    }

    const data = await request.json();
    if (!data.name) {
      return NextResponse.json(
        { message: "Le champ 'name' est obligatoire." },
        { status: 400 }
      );
    }

    const location = await prisma.stockLocation.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        warehouseId: warehouseId,
        zone: data.zone ?? null,
        aisle: data.aisle ?? null,
        shelf: data.shelf ?? null,
        bin: data.bin ?? null,
        active: true,
      },
    });

    return NextResponse.json(location, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur lors de la création de l'emplacement." },
      { status: 500 }
    );
  }
}
