import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const settingsUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  logo: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

export const GET = withPermission(PERMISSIONS.ORG_SETTINGS)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string }> }
  ) => {
    const { organizationId } = await params;

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        id: true,
        name: true,
        description: true,
        logo: true,
        address: true,
        phone: true,
        email: true,
        domain: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!organization) {
      return NextResponse.json({ error: "Organisation introuvable" }, { status: 404 });
    }

    return NextResponse.json(organization);
  }
);

export const PUT = withPermission(PERMISSIONS.ORG_SETTINGS)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string }> }
  ) => {
    const { organizationId } = await params;

    try {
      const json = await req.json();
      const data = settingsUpdateSchema.parse(json);

      const organization = await prisma.organization.update({
        where: { id: organizationId },
        data,
      });

      return NextResponse.json(organization);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error }, { status: 400 });
      }
      return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
  }
);