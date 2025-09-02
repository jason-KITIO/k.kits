import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import prisma from "@/lib/prisma"
import { z } from "zod";
import { notificationCreateSchema } from "@/schema/notification.schema";

export const GET = withPermission(PERMISSIONS.NOTIFICATION_READ)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string }> }
  ) => {
    const { organizationId } = await params;
    const userId = req.headers.get("user-id");

    const notifications = await prisma.notification.findMany({
      where: { 
        organizationId,
        userId: userId || undefined,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(notifications);
  }
);

export const POST = withPermission(PERMISSIONS.NOTIFICATION_CREATE)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string }> }
  ) => {
    const { organizationId } = await params;

    try {
      const json = await req.json();
      const data = notificationCreateSchema.parse(json);

      const notification = await prisma.notification.create({
        data: {
          ...data,
          organizationId,
        },
      });

      return NextResponse.json(notification, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error }, { status: 400 });
      }
      return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
  }
);