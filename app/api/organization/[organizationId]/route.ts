import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"
import { z } from "zod";
import { organizationUpdateSchema } from "@/schema/organization-schema";

export async function GET(
  req: NextRequest,
  { params }: { params: { organizationId: string } }
) {
  const { organizationId } = params;

  try {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organisation non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(organization);
  } catch (error) {
    console.error("Erreur GET /organizations/[organizationId]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { organizationId: string } }
) {
  const { organizationId } = params;

  try {
    const body = await req.json();
    const parsed = organizationUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    const updatedOrg = await prisma.organization.update({
      where: { id: organizationId },
      data: parsed.data,
    });

    return NextResponse.json(updatedOrg);
  } catch (error) {
    console.error("Erreur PUT /organizations/[organizationId]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  const { organizationId } = await params;

  try {
    // Suppression organisation + cascade automatique des relations
    await prisma.organization.delete({
      where: { id: organizationId },
    });

    return new Response(null, { status: 204 }); // No Content
  } catch (error) {
    console.error("Erreur DELETE /organizations/[organizationId]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
