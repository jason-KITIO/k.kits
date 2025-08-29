import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const organizationId = request.cookies.get("selected-org-id")?.value;
    if (!organizationId) {
      return NextResponse.json(
        { message: "Organisation non sélectionnée." },
        { status: 403 }
      );
    }
    checkOrganization(request, organizationId);

    const data = await request.json();
    if (!data.userId || !data.productId || typeof data.quantity !== "number") {
      return NextResponse.json(
        { message: "userId, productId et quantity sont obligatoires." },
        { status: 400 }
      );
    }

    // Vérifier que user est membre de l'organisation
    const member = await prisma.organizationMember.findFirst({
      where: { userId: data.userId, organizationId, active: true },
    });
    if (!member) {
      return NextResponse.json(
        { message: "Utilisateur non membre de l'organisation." },
        { status: 403 }
      );
    }

    // Vérifier que le produit appartient à l'organisation
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });
    if (!product || product.organizationId !== organizationId) {
      return NextResponse.json(
        { message: "Produit non trouvé dans cette organisation." },
        { status: 404 }
      );
    }

    // Recherche existante
    let employeeStock = await prisma.employeeStock.findFirst({
      where: { userId: data.userId, productId: data.productId },
    });

    if (employeeStock) {
      employeeStock = await prisma.employeeStock.update({
        where: { id: employeeStock.id },
        data: {
          quantity: data.quantity,
          reservedQty: data.reservedQty ?? employeeStock.reservedQty,
          lastUpdated: new Date(),
        },
      });
    } else {
      employeeStock = await prisma.employeeStock.create({
        data: {
          userId: data.userId,
          productId: data.productId,
          quantity: data.quantity,
          reservedQty: data.reservedQty ?? 0,
          lastUpdated: new Date(),
        },
      });
    }

    return NextResponse.json(employeeStock);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Erreur serveur." },
      { status: 500 }
    );
  }
}
