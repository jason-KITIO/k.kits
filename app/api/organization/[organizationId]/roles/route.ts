import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"
import { roleCreateSchema } from "@/schema/role-schema";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";

// GET - Lire les rôles (permission USER_ROLES)
export const GET = withPermission(PERMISSIONS.USER_ROLES)(
  async (req: NextRequest, { params }: any) => {
    const { organizationId } = await params;

    try {
      const roles = await prisma.role.findMany({
        where: {
          OrganizationRole: {
            some: { organizationId },
          },
          active: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(roles);
    } catch (error) {
      console.error("Erreur GET roles", error);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }
);

// POST - Créer un rôle (permission USER_MANAGE)
export const POST = withPermission(PERMISSIONS.USER_MANAGE)(
  async (req: NextRequest, { params }: any) => {
    const { organizationId } = await params;
    
    try {
      const body = await req.json();
      const parsed = roleCreateSchema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
      }

      const newRole = await prisma.role.create({
        data: {
          name: parsed.data.name,
          description: parsed.data.description ?? null,
          color: parsed.data.color ?? null,
          active: parsed.data.active ?? true,
          OrganizationRole: {
            create: { organizationId },
          },
        },
        include: { OrganizationRole: true },
      });

      return NextResponse.json(newRole, { status: 201 });
    } catch (error) {
      console.error("Erreur POST role", error);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }
);
