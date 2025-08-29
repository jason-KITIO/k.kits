import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest, { params }: { params: { alertId: string } }) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    if (!organizationId) 
      return NextResponse.json({ message: "Organisation non sélectionnée." }, { status: 403 });
    checkOrganization(request, organizationId);

    const alert = await prisma.stockAlert.findUnique({
      where: { id: params.alertId },
      include: { product: true },
    });

    if (!alert || alert.product.organizationId !== organizationId) {
      return NextResponse.json({ message: "Alerte non trouvée ou accès refusé." }, { status: 404 });
    }

    const updated = await prisma.stockAlert.update({
      where: { id: params.alertId },
      data: { isRead: true, readAt: new Date() },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Erreur serveur." }, { status: 500 });
  }
}
