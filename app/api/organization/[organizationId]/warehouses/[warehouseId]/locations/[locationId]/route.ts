import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";
import { verifyLocationOwnership } from "@/helper/verify-location-ownership";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      organizationId: string;
      warehouseId: string;
      locationId: string;
    }>;
  }
) {
  try {
    const { organizationId, warehouseId, locationId } = await params;
    // Vérification organisation via cookie et param URL
    checkOrganization(organizationId);

    // Vérifier que le location appartient bien à cette organisation
    const location = await verifyLocationOwnership(locationId, organizationId);
    if (!location) {
      return NextResponse.json(
        { message: "Emplacement non trouvé ou accès refusé." },
        { status: 404 }
      );
    }

    return NextResponse.json(location);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: "Erreur serveur lors de la récupération de l'emplacement.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      organizationId: string;
      warehouseId: string;
      locationId: string;
    }>;
  }
) {
  try {
    const { organizationId, warehouseId, locationId } = await params;
    checkOrganization(organizationId);

    // Vérifier que l'emplacement existe et appartient à l'organisation
    const existing = await verifyLocationOwnership(locationId, organizationId);
    if (!existing) {
      return NextResponse.json(
        { message: "Emplacement non trouvé ou accès refusé." },
        { status: 404 }
      );
    }

    const data = await request.json();

    const updated = await prisma.stockLocation.update({
      where: { id: locationId },
      data: {
        name: data.name ?? existing.name,
        description: data.description ?? existing.description,
        zone: data.zone ?? existing.zone,
        aisle: data.aisle ?? existing.aisle,
        shelf: data.shelf ?? existing.shelf,
        bin: data.bin ?? existing.bin,
        active: data.active ?? existing.active,
      },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: "Erreur serveur lors de la mise à jour de l'emplacement.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ organizationId: string; warehouseId: string; locationId: string }>;
  }
) {
  try {
    const { organizationId, warehouseId, locationId } = await params;
    checkOrganization(organizationId);

    const existing = await verifyLocationOwnership(
      locationId,
      organizationId
    );
    if (!existing) {
      return NextResponse.json(
        { message: "Emplacement non trouvé ou accès refusé." },
        { status: 404 }
      );
    }

    await prisma.stockLocation.delete({ where: { id: locationId } });

    return NextResponse.json({ message: "Emplacement supprimé avec succès." });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message:
          "Erreur serveur lors de la suppression de l'emplacement.",
      },
      { status: 500 }
    );
  }
}
