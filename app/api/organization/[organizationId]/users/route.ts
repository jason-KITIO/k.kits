import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOrganization } from "@/helper/check-organization";
import { handleApiError } from "@/lib/error-handler";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { organizationId: string } }
) {
  try {
    const { organizationId } = params;

    const organizationCheck = await checkOrganization(organizationId);
    if (!organizationCheck.success) {
      return NextResponse.json(
        { message: organizationCheck.message },
        { status: organizationCheck.status }
      );
    }

    const users = await prisma.organizationMember.findMany({
      where: {
        organizationId: organizationId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            createdAt: true,
          },
        },
        role: {
          select: {
            id: true,
            name: true,
            permissions: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(users);
  } catch {
    return handleApiError(error, "users GET");
  }
}
