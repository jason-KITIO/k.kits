import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import { invitationUpdateSchema } from "@/schema/invitation-schema";

// GET - Lire une invitation (permission USER_INVITE)
export const GET = withPermission(PERMISSIONS.USER_INVITE)(
  async (req: NextRequest, { params }: any) => {
    const { organizationId, invitationId } = await params;

    try {
      const invitation = await prisma.invitation.findFirst({
        where: { 
          id: invitationId, 
          organizationId 
        },
        include: { 
          role: true,
          organization: { select: { name: true } }
        },
      });

      if (!invitation) {
        return NextResponse.json(
          { error: "Invitation non trouvée" },
          { status: 404 }
        );
      }

      return NextResponse.json(invitation);
    } catch (error) {
      console.error("Erreur GET invitation", error);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }
);

// PUT - Modifier une invitation (permission USER_INVITE)
export const PUT = withPermission(PERMISSIONS.USER_INVITE)(
  async (req: NextRequest, { params }: any) => {
    const { organizationId, invitationId } = await params;
    
    try {
      const body = await req.json();
      const parsed = invitationUpdateSchema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
      }

      // Vérifier que l'invitation existe et est modifiable
      const existingInvitation = await prisma.invitation.findFirst({
        where: { 
          id: invitationId, 
          organizationId,
          status: "PENDING"
        }
      });

      if (!existingInvitation) {
        return NextResponse.json(
          { error: "Invitation non trouvée ou non modifiable" },
          { status: 404 }
        );
      }

      const updatedInvitation = await prisma.invitation.update({
        where: { id: invitationId },
        data: parsed.data,
        include: { 
          role: true,
          organization: { select: { name: true } }
        },
      });

      return NextResponse.json(updatedInvitation);
    } catch (error) {
      console.error("Erreur PUT invitation", error);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }
);

// DELETE - Annuler une invitation (permission USER_INVITE)
export const DELETE = withPermission(PERMISSIONS.USER_INVITE)(
  async (req: NextRequest, { params }: any) => {
    const { organizationId, invitationId } = await params;

    try {
      const existingInvitation = await prisma.invitation.findFirst({
        where: { 
          id: invitationId, 
          organizationId 
        }
      });

      if (!existingInvitation) {
        return NextResponse.json(
          { error: "Invitation non trouvée" },
          { status: 404 }
        );
      }

      // Marquer comme annulée au lieu de supprimer
      await prisma.invitation.update({
        where: { id: invitationId },
        data: { status: "CANCELLED" }
      });

      return new Response(null, { status: 204 });
    } catch (error) {
      console.error("Erreur DELETE invitation", error);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }
);