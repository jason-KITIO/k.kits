import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import { invitationCreateSchema } from "@/schema/invitation-schema";
import { sendInvitationEmail } from "@/lib/invitation-email";

// GET - Lire les invitations (permission USER_INVITE)
export const GET = withPermission(PERMISSIONS.USER_INVITE)(
  async (req: NextRequest, { params }: any) => {
    const { organizationId } = await params;

    try {
      const invitations = await prisma.invitation.findMany({
        where: { organizationId },
        include: {
          role: true,
          organization: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(invitations);
    } catch (error) {
      console.error("Erreur GET invitations", error);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }
);

// POST - Créer une invitation (permission USER_INVITE)
export const POST = withPermission(PERMISSIONS.USER_INVITE)(
  async (req: NextRequest, { params, user }: any) => {
    const { organizationId } = await params;

    try {
      const body = await req.json();
      const parsed = invitationCreateSchema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.issues },
          { status: 400 }
        );
      }

      // Vérifier que l'email n'est pas déjà membre
      const existingUser = await prisma.user.findUnique({
        where: { email: parsed.data.email },
        include: {
          organizationMembers: {
            where: { organizationId },
          },
        },
      });

      if (existingUser && existingUser?.organizationMembers.length > 0) {
        return NextResponse.json(
          { error: "Cet utilisateur est déjà membre de l'organisation" },
          { status: 400 }
        );
      }

      // Vérifier que le rôle existe dans l'organisation
      const roleExists = await prisma.role.findFirst({
        where: {
          id: parsed.data.roleId,
          OrganizationRole: {
            some: { organizationId },
          },
        },
      });

      if (!roleExists) {
        return NextResponse.json(
          { error: "Rôle non trouvé dans cette organisation" },
          { status: 400 }
        );
      }

      const token = crypto.randomUUID();

      const newInvitation = await prisma.invitation.create({
        data: {
          email: parsed.data.email,
          roleId: parsed.data.roleId,
          organizationId,
          invitedBy: user.id,
          token,
          status: "PENDING",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        include: {
          role: true,
          organization: { select: { name: true } },
        },
      });

      // Récupérer info boutique si spécifiée
      let storeName;
      if (parsed.data.storeId) {
        const store = await prisma.store.findUnique({
          where: { id: parsed.data.storeId },
          select: { name: true },
        });
        storeName = store?.name;
      }

      // Envoyer l'email d'invitation
      await sendInvitationEmail({
        email: parsed.data.email,
        organizationName: newInvitation.organization.name,
        roleName: newInvitation.role.name,
        storeName,
        token,
        inviterName: user.firstName
          ? `${user.firstName} ${user.lastName || ""}`.trim()
          : user.email,
      });

      return NextResponse.json(newInvitation, { status: 201 });
    } catch (error) {
      console.error("Erreur POST invitation", error);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }
);
