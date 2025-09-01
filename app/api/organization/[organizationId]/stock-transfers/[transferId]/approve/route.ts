import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ transferId: string }> }
) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    const approverId = request.cookies.get("user-id")?.value;
    if (!organizationId || !approverId) {
      return NextResponse.json(
        { message: "Organisation ou utilisateur non authentifié" },
        { status: 403 }
      );
    }
    checkOrganization(organizationId);
    const { transferId } = await params;

    const transfer = await prisma.stockTransfer.findUnique({
      where: { id: transferId },
      include: { product: true },
    });

    if (!transfer || transfer.product.organizationId !== organizationId) {
      return NextResponse.json(
        { message: "Transfert non trouvé ou accès refusé" },
        { status: 404 }
      );
    }

    if (transfer.status !== "PENDING") {
      return NextResponse.json(
        { message: "Transfert non en attente d'approbation" },
        { status: 400 }
      );
    }

    const updated = await prisma.stockTransfer.update({
      where: { id: transferId },
      data: {
        status: "APPROVED",
        approvedBy: approverId,
        approvedAt: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Erreur serveur" },
      { status: 500 }
    );
  }
}
