import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/organization/[id]
 * Récupère les infos détaillées d'une organisation par son ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { message: "ID d'organisation requis" },
      { status: 400 }
    );
  }

  try {
    const organization = await prisma.organization.findUnique({
      where: { id },
      include: {
        members: {
          where: { active: true },
          select: {
            id: true,
            joinedAt: true,
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                profileImageUrl: true,
              },
            },
          },
        },
        warehouses: true,
        suppliers: true,
        categories: true,
        products: true,
        purchaseOrders: true,
        UserRole: {
          where: { active: true },
          include: { role: true },
        },
        OrganizationRole: {
          include: { role: true },
        },
      },
    });

    if (!organization) {
      return NextResponse.json(
        { message: "Organisation non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({ organization });
  } catch {
    console.error("Erreur récupération organisation:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
