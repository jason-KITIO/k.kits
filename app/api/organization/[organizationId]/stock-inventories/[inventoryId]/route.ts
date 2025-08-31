import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

async function getInventory(id: string) {
  return await prisma.stockInventory.findUnique({
    where: { id },
    include: {
      product: true,
      warehouse: true,
      employee: true,
      performedByUser: true,
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ inventoryId: string }> }
) {
  try {
    const { inventoryId } = await params;
    const organizationId = request.cookies.get("selected-org-id")?.value;
    if (!organizationId)
      return NextResponse.json(
        { message: "Organisation non sélectionnée." },
        { status: 403 }
      );
    checkOrganization(organizationId);

    const inventory = await getInventory(inventoryId);

    if (!inventory || inventory.product.organizationId !== organizationId) {
      return NextResponse.json(
        { message: "Inventaire non trouvé ou accès refusé." },
        { status: 404 }
      );
    }

    return NextResponse.json(inventory);
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ inventoryId: string }> }
) {
  try {
    const { inventoryId } = await params;
    const organizationId = request.cookies.get("selected-org-id")?.value;
    const performedByUserId = request.cookies.get("user-id")?.value;
    if (!organizationId || !performedByUserId)
      return NextResponse.json(
        { message: "Organisation ou utilisateur non authentifié." },
        { status: 403 }
      );
    checkOrganization(organizationId);

    const existing = await getInventory(inventoryId);
    if (!existing || existing.product.organizationId !== organizationId)
      return NextResponse.json(
        { message: "Inventaire non trouvé ou accès refusé." },
        { status: 404 }
      );

    const data = await request.json();

    const updated = await prisma.stockInventory.update({
      where: { id: inventoryId },
      data: {
        expectedQty: data.expectedQty ?? existing.expectedQty,
        actualQty: data.actualQty ?? existing.actualQty,
        difference:
          (data.actualQty ?? existing.actualQty) -
          (data.expectedQty ?? existing.expectedQty),
        notes: data.notes ?? existing.notes,
        status: data.status ?? existing.status,
        performedBy: performedByUserId,
        scheduledDate: data.scheduledDate
          ? new Date(data.scheduledDate)
          : existing.scheduledDate,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ inventoryId: string }> }
) {
  try {
    const { inventoryId } = await params;
    const organizationId = request.cookies.get("selected-org-id")?.value;
    if (!organizationId)
      return NextResponse.json(
        { message: "Organisation non sélectionnée." },
        { status: 403 }
      );
    checkOrganization(organizationId);

    const inventory = await getInventory(inventoryId);
    if (!inventory || inventory.product.organizationId !== organizationId)
      return NextResponse.json(
        { message: "Inventaire non trouvé ou accès refusé." },
        { status: 404 }
      );

    await prisma.stockInventory.delete({ where: { id: inventoryId } });

    return NextResponse.json({ message: "Inventaire supprimé avec succès." });
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur." },
      { status: 500 }
    );
  }
}