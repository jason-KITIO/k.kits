import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import { organizationSettingsUpdateSchema } from "@/schema/organization-settings.schema";

// GET - Lire les paramètres de l'organisation
export const GET = withPermission(PERMISSIONS.ORG_SETTINGS)(
  async (req: NextRequest, { params }: any) => {
    const { organizationId } = await params;

    try {
      const organization = await prisma.organization.findUnique({
        where: { id: organizationId },
        select: {
          id: true,
          name: true,
          description: true,
          email: true,
          phone: true,
          address: true,
          logo: true,
          domain: true,
          createdAt: true,
          updatedAt: true,
          settings: true,
        },
      });

      if (!organization) {
        return NextResponse.json(
          { error: "Organisation non trouvée" },
          { status: 404 }
        );
      }

      return NextResponse.json(organization);
    } catch (error) {
      console.error("Erreur GET settings", error);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }
);

// PUT - Mettre à jour les paramètres de l'organisation
export const PUT = withPermission(PERMISSIONS.ORG_SETTINGS)(
  async (req: NextRequest, { params }: any) => {
    const { organizationId } = await params;

    try {
      const body = await req.json();
      const parsed = organizationSettingsUpdateSchema.safeParse(body);
      
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Données invalides", details: parsed.error.issues },
          { status: 400 }
        );
      }
      
      const { settings, ...organizationData } = parsed.data;

      const updatedOrganization = await prisma.organization.update({
        where: { id: organizationId },
        data: {
          ...organizationData,
          settings: settings || {},
        },
        select: {
          id: true,
          name: true,
          description: true,
          email: true,
          phone: true,
          address: true,
          logo: true,
          domain: true,
          createdAt: true,
          updatedAt: true,
          settings: true,
        },
      });

      return NextResponse.json(updatedOrganization);
    } catch (error) {
      console.error("Erreur PUT settings", error);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }
);