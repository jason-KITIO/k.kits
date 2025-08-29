import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

interface Params {
  token: string;
}

export async function POST(
  request: NextRequest,
  context: { params: Params | Promise<Params> }
) {
  try {
    const token = request.nextUrl.searchParams.get("token") || "";
    const { username, password } = await request.json();

    if (!username || !password || !token) {
      return NextResponse.json(
        { message: "Username, mot de passe et token sont requis" },
        { status: 400 }
      );
    }

    // Trouver l'invitation par token
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: { role: true, organization: true },
    });

    if (
      !invitation ||
      invitation.status !== "pending" ||
      invitation.expiresAt < new Date()
    ) {
      return NextResponse.json(
        { message: "Invitation invalide, expirée ou déjà utilisée" },
        { status: 400 }
      );
    }

    const email = invitation.email; // email récupéré automatiquement ici

    // Vérifier qu'aucun utilisateur ne possède déjà cet email ou username
    const userExists = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (userExists) {
      return NextResponse.json(
        { message: "Un utilisateur avec cet email ou username existe déjà" },
        { status: 409 }
      );
    }

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        emailVerified: true,
      },
    });
    // Après la création de l'utilisateur (user) dans votre endpoint
    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: invitation.roleId,
        organizationId: invitation.organizationId,
        assignedAt: new Date(),
        active: true,
        // Vous pouvez aussi ajouter assignedBy si vous le voulez (ex: invitation.invitedBy)
      },
    });

    // Créer le membre dans l'organisation
    await prisma.organizationMember.create({
      data: {
        userId: user.id,
        organizationId: invitation.organizationId,
        active: true,
        joinedAt: new Date(),
        invitedBy: invitation.invitedBy,
      },
    });

    // Mettre à jour l'invitation en accepted
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { status: "accepted" },
    });

    return NextResponse.json({
      message: "Compte créé et invitation acceptée avec succès",
    });
  } catch (error) {
    console.error("Erreur acceptation invitation:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
