import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"
import { z } from "zod";
import { organizationCreateSchema } from "@/schema/organization-schema";
import { seedPermissions, assignOwnerRole, linkRolesToOrganization } from "@/lib/seed-permissions";

export async function GET(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get("session_token")?.value;
    if (!sessionToken) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    const session = await prisma.userSession.findUnique({
      where: { sessionToken },
    });

    if (
      !session ||
      !session.active ||
      (session.expiresAt && session.expiresAt < new Date())
    ) {
      return NextResponse.json(
        { error: "Session invalide ou expirée" },
        { status: 401 }
      );
    }

    const userId = session.userId;

    // Récupérer organisations de l'utilisateur via la table UserRole (multi-tenant)
    const organizations = await prisma.organization.findMany({
      where: {
        UserRole: {
          some: {
            userId,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(organizations);
  } catch (error) {
    console.error("Erreur GET /organizations", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get("session_token")?.value;
    if (!sessionToken) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    const session = await prisma.userSession.findUnique({
      where: { sessionToken },
    });

    if (
      !session ||
      !session.active ||
      (session.expiresAt && session.expiresAt < new Date())
    ) {
      return NextResponse.json(
        { error: "Session invalide ou expirée" },
        { status: 401 }
      );
    }

    const userId = session.userId;

    const body = await req.json();
    // console.log("Body reçu:", body);
    
    const parsed = organizationCreateSchema.safeParse(body);

    if (!parsed.success) {
      // console.log("Erreurs validation:", parsed.error.issues);
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    // 1. Initialiser les permissions et rôles de base (seulement si nécessaire)
    await seedPermissions();

    // 2. Utiliser une transaction pour toutes les opérations
    const result = await prisma.$transaction(async (tx) => {
      // Création organisation
      const newOrg = await tx.organization.create({
        data: {
          name: parsed.data.name,
          description: parsed.data.description,
          domain: parsed.data.domain,
          logo: parsed.data.logo,
          address: parsed.data.address,
          phone: parsed.data.phone,
          email: parsed.data.email,
          createdBy: userId,
        },
      });

      return newOrg;
    });

    // 3. Lier tous les rôles par défaut à cette organisation
    await linkRolesToOrganization(result.id);

    // 4. Assigner le rôle OWNER au créateur
    await assignOwnerRole(userId, result.id);

    const newOrg = result;

    // console.log("Organisation créée avec succès:", newOrg.id);
    return NextResponse.json(newOrg, { status: 201 });
  } catch (error) {
    console.error("Erreur POST /organizations", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
