import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = withPermission(PERMISSIONS.USER_MANAGE)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string }> }
  ) => {
    const { organizationId } = await params;

    const members = await prisma.organizationMember.findMany({
      where: { organizationId, active: true },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            lastSignInAt: true,
            createdAt: true,
          },
        },
        role: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
      orderBy: { joinedAt: "desc" },
    });

    return NextResponse.json(members);
  }
);