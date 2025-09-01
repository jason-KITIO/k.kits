import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import { z } from 'zod';

const prisma = new PrismaClient();

// Schéma de validation pour création d'organisation
const organizationCreateSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(255).optional(),
});

export async function GET(req: NextRequest) {
  try {
    // Récupérer l'id utilisateur depuis le header injecté par middleware
    // (Sinon gérer différemment selon ta méthode d'auth)
    const userId = req.headers.get('X-User-Id');
    if (!userId) {
      return NextResponse.json({ error: 'Utilisateur non authentifié' }, { status: 401 });
    }

    // Récupérer organisations de l'utilisateur via la table UserRole (multi-tenant)
    const organizations = await prisma.organization.findMany({
      where: {
        UserRole: {
          some: {
            userId,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(organizations);
  } catch (error) {
    console.error('Erreur GET /organizations', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('X-User-Id');
    if (!userId) {
      return NextResponse.json({ error: 'Utilisateur non authentifié' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = organizationCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    // Création organisation
    const newOrg = await prisma.organization.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
      },
    });

    // Assignation du rôle "owner" à l'utilisateur sur cette organisation (exemple)
    // Supposons le rôle 'owner' existe dans ta table Role avec un code 'owner'
    const ownerRole = await prisma.role.findUniqueOrThrow({
      where: { name: 'owner' },
    });

    await prisma.userRole.create({
      data: {
        userId,
        organizationId: newOrg.id,
        roleId: ownerRole.id,
        storeId: null, // Rôle global à l'organisation
      },
    });

    return NextResponse.json(newOrg, { status: 201 });
  } catch (error) {
    console.error('Erreur POST /organizations', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
