import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"

// GET - Valider un token d'invitation pour le frontend
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token manquant", valid: false },
        { status: 400 }
      );
    }

    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: {
        role: true,
        organization: { select: { name: true } }
      }
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation non trouvée", valid: false },
        { status: 404 }
      );
    }

    if (invitation.status !== "PENDING") {
      return NextResponse.json(
        { 
          error: "Invitation déjà utilisée ou expirée", 
          valid: false,
          status: invitation.status 
        },
        { status: 400 }
      );
    }

    if (invitation.expiresAt < new Date()) {
      // Marquer comme expirée
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: "EXPIRED" }
      });

      return NextResponse.json(
        { error: "Invitation expirée", valid: false },
        { status: 400 }
      );
    }

    // Retourner les infos pour pré-remplir le formulaire
    return NextResponse.json({
      valid: true,
      email: invitation.email,
      organizationName: invitation.organization.name,
      roleName: invitation.role.name,
      organizationId: invitation.organizationId,
      roleId: invitation.roleId,
    });

  } catch (error) {
    console.error("Erreur validation invitation", error);
    return NextResponse.json(
      { error: "Erreur serveur", valid: false }, 
      { status: 500 }
    );
  }
}