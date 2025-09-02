import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const assignRoleSchema = z.object({
  roleId: z.string(),
  storeId: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
});

export const GET = withPermission(PERMISSIONS.USER_ROLES)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string; userId: string }> }
  ) => {
    const { organizationId, userId } = await params;

    const userRoles = await prisma.userRole.findMany({
      where: { userId, organizationId, active: true },
      include: {
        role: { select: { name: true, color: true } },
        store: { select: { name: true } },
      },
    });

    return NextResponse.json(userRoles);
  }
);

export const POST = withPermission(PERMISSIONS.USER_ROLES)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string; userId: string }> }
  ) => {
    const { organizationId, userId } = await params;

    try {
      const json = await req.json();
      const data = assignRoleSchema.parse(json);

      const userRole = await prisma.userRole.create({
        data: {
          userId,
          roleId: data.roleId,
          organizationId,
          storeId: data.storeId,
          expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
          assignedBy: req.headers.get("user-id") || "",
        },
      });

      return NextResponse.json(userRole, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error }, { status: 400 });
      }
      return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
  }
);