import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ alertId: string }> }
) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    if (!organizationId)
      return NextResponse.json(
        { message: "Organisation non sélectionnée." },
        { status: 403 }
      );
    checkOrganization(organizationId);

    const { alertId } = await params;
    const alert = await prisma.stockAlert.findUnique({
      where: { id: alertId },
      include: { product: true },
    });

    if (!alert || alert.product.organizationId !== organizationId) {
      return NextResponse.json(
        { message: "Alerte non trouvée ou accès refusé." },
        { status: 404 }
      );
    }

    await prisma.stockAlert.delete({ where: { id: alertId } });

    return NextResponse.json({ message: "Alerte supprimée avec succès." });
  } catch {
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}
