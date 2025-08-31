import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  try {
    const { organizationId } = await params;
    checkOrganization(organizationId);

    const roles = await prisma.role.findMany({
      where: { organizationId },
      include: { permissions: true },
    });

    return NextResponse.json(roles);
  } catch {
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}