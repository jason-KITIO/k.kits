import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"
import { roleUpdateSchema } from "@/schema/role-schema";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";


// GET - Lire un rôle (permission USER_ROLES)
export const GET = withPermission(PERMISSIONS.USER_ROLES)(
  async (req: NextRequest, { params }: any) => {
    const { organizationId, roleId } = await params;

    try {
      const role = await prisma.role.findFirst({
        where: {
          id: roleId,
          OrganizationRole: {
            some: { organizationId },
          },
        },
      });
      if (!role)
        return NextResponse.json({ error: "Rôle non trouvé" }, { status: 404 });

      return NextResponse.json(role);
    } catch (error) {
      console.error("Erreur GET role", error);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }
);

// PUT - Modifier un rôle (permission USER_MANAGE)
export const PUT = withPermission(PERMISSIONS.USER_MANAGE)(
  async (req: NextRequest, { params }: any) => {
    const { organizationId, roleId } = await params;
    
    try {
      const body = await req.json();
      const parsed = roleUpdateSchema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
      }

      const existRole = await prisma.role.findFirst({
        where: {
          id: roleId,
          OrganizationRole: { some: { organizationId } },
        },
      });
      if (!existRole)
        return NextResponse.json({ error: "Rôle non trouvé" }, { status: 404 });

      const updatedRole = await prisma.role.update({
        where: { id: roleId },
        data: parsed.data,
      });

      return NextResponse.json(updatedRole);
    } catch (error) {
      console.error("Erreur PUT role", error);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }
);

// DELETE - Supprimer un rôle (permission USER_MANAGE)
export const DELETE = withPermission(PERMISSIONS.USER_MANAGE)(
  async (req: NextRequest, { params }: any) => {
    const { organizationId, roleId } = await params;

    try {
      const existRole = await prisma.role.findFirst({
        where: {
          id: roleId,
          OrganizationRole: { some: { organizationId } },
        },
      });
      if (!existRole)
        return NextResponse.json({ error: "Rôle non trouvé" }, { status: 404 });

      await prisma.role.delete({
        where: { id: roleId },
      });

      return new Response(null, { status: 204 });
    } catch (error) {
      console.error("Erreur DELETE role", error);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }
);
