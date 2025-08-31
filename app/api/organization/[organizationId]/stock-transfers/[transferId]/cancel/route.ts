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
    const cancellerId = request.cookies.get("user-id")?.value;
    if (!organizationId || !cancellerId) {
      return NextResponse.json(
        { message: "Organisation ou utilisateur non authentifié" },
        { status: 403 }
      );
    }
    checkOrganization(organizationId);

    const transfer = await prisma.stockTransfer.findUnique({
      where: { id: params.transferId },
      include: { product: true },
    });

    if (!transfer || transfer.product.organizationId !== organizationId) {
      return NextResponse.json(
        { message: "Transfert non trouvé ou accès refusé" },
        { status: 404 }
      );
    }

    if (transfer.status === "COMPLETED" || transfer.status === "CANCELLED") {
      return NextResponse.json(
        { message: "Transfert déjà finalisé ou annulé" },
        { status: 400 }
      );
    }

    const updated = await prisma.stockTransfer.update({
      where: { id: params.transferId },
      data: {
        status: "CANCELLED",
        completedBy: cancellerId,
        completedAt: new Date(),
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
