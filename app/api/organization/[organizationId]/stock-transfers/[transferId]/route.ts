import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ transferId: string }> }
) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    if (!organizationId) {
      return NextResponse.json(
        { message: "Organisation non sélectionnée" },
        { status: 403 }
      );
    }
    checkOrganization(organizationId);

    const transfer = await prisma.stockTransfer.findUnique({
      where: { id: params.transferId },
      include: {
        product: true,
        sourceWarehouse: true,
        destWarehouse: true,
        sourceUser: true,
        destUser: true,
        requester: true,
        // approvedByUser: true,
        // completedByUser: true,
      },
    });

    if (!transfer || transfer.product.organizationId !== organizationId) {
      return NextResponse.json(
        { message: "Transfert non trouvé ou accès refusé" },
        { status: 404 }
      );
    }

    return NextResponse.json(transfer);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Erreur serveur" },
      { status: 500 }
    );
  }
}
