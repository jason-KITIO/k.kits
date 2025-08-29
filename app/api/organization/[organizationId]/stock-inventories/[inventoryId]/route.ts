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

export async function GET(request: NextRequest, { params }: { params: { inventoryId: string } }) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    if (!organizationId) return NextResponse.json({ message: "Organisation non sélectionnée." }, { status: 403 });
    checkOrganization(request, organizationId);

    const inventory = await getInventory(params.inventoryId);

    if (!inventory || inventory.product.organizationId !== organizationId) {
      return NextResponse.json({ message: "Inventaire non trouvé ou accès refusé." }, { status: 404 });
    }

    return NextResponse.json(inventory);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Erreur serveur." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { inventoryId: string } }) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    const performedByUserId = request.cookies.get("user-id")?.value;
    if (!organizationId || !performedByUserId) return NextResponse.json({ message: "Organisation ou utilisateur non authentifié." }, { status: 403 });
    checkOrganization(request, organizationId);

    const existing = await getInventory(params.inventoryId);
    if (!existing || existing.product.organizationId !== organizationId)
      return NextResponse.json({ message: "Inventaire non trouvé ou accès refusé." }, { status: 404 });

    const data = await request.json();

    const updated = await prisma.stockInventory.update({
      where: { id: params.inventoryId },
      data: {
        expectedQty: data.expectedQty ?? existing.expectedQty,
        actualQty: data.actualQty ?? existing.actualQty,
        difference: (data.actualQty ?? existing.actualQty) - (data.expectedQty ?? existing.expectedQty),
        notes: data.notes ?? existing.notes,
        status: data.status ?? existing.status,
        performedBy: performedByUserId,
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : existing.scheduledDate,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Erreur serveur." }, { status: 500 });
  }
}

// Pour finaliser un inventaire : status passé à COMPLETED et date complétée
export async function PUT_complete(request: NextRequest, { params }: { params: { inventoryId: string } }) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    const performedByUserId = request.cookies.get("user-id")?.value;
    if (!organizationId || !performedByUserId) return NextResponse.json({ message: "Organisation ou utilisateur non authentifié." }, { status: 403 });
    checkOrganization(request, organizationId);

    const inventory = await getInventory(params.inventoryId);
    if (!inventory || inventory.product.organizationId !== organizationId)
      return NextResponse.json({ message: "Inventaire non trouvé ou accès refusé." }, { status: 404 });

    if (inventory.status === "COMPLETED")
      return NextResponse.json({ message: "Inventaire déjà finalisé." }, { status: 400 });

    const completed = await prisma.stockInventory.update({
      where: { id: params.inventoryId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        performedBy: performedByUserId,
      },
    });

    return NextResponse.json(completed);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Erreur serveur." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { inventoryId: string } }) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    if (!organizationId) return NextResponse.json({ message: "Organisation non sélectionnée." }, { status: 403 });
    checkOrganization(request, organizationId);

    const inventory = await getInventory(params.inventoryId);
    if (!inventory || inventory.product.organizationId !== organizationId)
      return NextResponse.json({ message: "Inventaire non trouvé ou accès refusé." }, { status: 404 });

    await prisma.stockInventory.delete({ where: { id: params.inventoryId } });

    return NextResponse.json({ message: "Inventaire supprimé avec succès." });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Erreur serveur." }, { status: 500 });
  }
}
