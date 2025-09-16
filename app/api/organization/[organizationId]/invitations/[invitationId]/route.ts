import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";

// DELETE - Annuler une invitation
export const DELETE = withPermission(PERMISSIONS.USER_INVITE)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string; invitationId: string }> }
  ) => {
    const { organizationId, invitationId } = await params;

    try {
      const invitation = await prisma.invitation.findFirst({
        where: {
          id: invitationId,
          organizationId,
          status: "PENDING",
        },
      });

      if (!invitation) {
        return NextResponse.json(
          { error: "Invitation non trouvée ou déjà traitée" },
          { status: 404 }
        );
      }

      await prisma.invitation.update({
        where: { id: invitationId },
        data: { status: "CANCELLED" },
      });

      return NextResponse.json({ message: "Invitation annulée" });
    } catch (error) {
      console.error("Erreur annulation invitation", error);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }
);