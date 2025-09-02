import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"

// GET - Valider un token d'invitation (route publique)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token manquant" },
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
        { error: "Invitation non trouvée" },
        { status: 404 }
      );
    }

    if (invitation.status !== "PENDING") {
      return NextResponse.json(
        { error: "Invitation déjà utilisée ou expirée" },
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
        { error: "Invitation expirée" },
        { status: 400 }
      );
    }

    // Retourner les infos pour l'inscription
    return NextResponse.json({
      email: invitation.email,
      organizationName: invitation.organization.name,
      roleName: invitation.role.name,
      organizationId: invitation.organizationId,
      roleId: invitation.roleId,
      valid: true
    });

  } catch (error) {
    console.error("Erreur validation invitation", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST - Accepter une invitation après inscription (route publique)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, userId } = body;

    if (!token || !userId) {
      return NextResponse.json(
        { error: "Token et userId requis" },
        { status: 400 }
      );
    }

    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: { role: true }
    });

    if (!invitation || invitation.status !== "PENDING") {
      return NextResponse.json(
        { error: "Invitation invalide" },
        { status: 400 }
      );
    }

    // Transaction pour accepter l'invitation
    await prisma.$transaction(async (tx) => {
      // Marquer l'invitation comme acceptée
      await tx.invitation.update({
        where: { id: invitation.id },
        data: { status: "ACCEPTED" }
      });

      // Ajouter l'utilisateur à l'organisation
      await tx.organizationMember.create({
        data: {
          userId,
          organizationId: invitation.organizationId,
          roleId: invitation.roleId,
          active: true
        }
      });

      // Assigner le rôle à l'utilisateur
      await tx.userRole.create({
        data: {
          userId,
          roleId: invitation.roleId,
          organizationId: invitation.organizationId,
          active: true
        }
      });
    });

    return NextResponse.json({ 
      message: "Invitation acceptée avec succès",
      organizationId: invitation.organizationId 
    });

  } catch (error) {
    console.error("Erreur acceptation invitation", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}