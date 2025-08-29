import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { transferId: string } }
) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    const completerId = request.cookies.get("user-id")?.value;
    if (!organizationId || !completerId) {
      return NextResponse.json(
        { message: "Organisation ou utilisateur non authentifié" },
        { status: 403 }
      );
    }
    checkOrganization(request, organizationId);

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

    if (transfer.status !== "APPROVED") {
      return NextResponse.json(
        { message: "Transfert non approuvé" },
        { status: 400 }
      );
    }

    const updated = await prisma.stockTransfer.update({
      where: { id: params.transferId },
      data: {
        status: "COMPLETED",
        completedBy: completerId,
        completedAt: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
