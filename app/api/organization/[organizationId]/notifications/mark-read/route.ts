import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import prisma from "@/lib/prisma"
import { z } from "zod";

const markReadSchema = z.object({
  notificationIds: z.array(z.string()).optional(),
  markAllAsRead: z.boolean().default(false),
});

export const POST = withPermission(PERMISSIONS.NOTIFICATION_UPDATE)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string }> }
  ) => {
    const { organizationId } = await params;
    const userId = req.headers.get("user-id");

    try {
      const json = await req.json();
      const data = markReadSchema.parse(json);

      if (data.markAllAsRead) {
        await prisma.notification.updateMany({
          where: {
            organizationId,
            userId: userId || undefined,
            read: false,
          },
          data: { read: true },
        });
      } else if (data.notificationIds) {
        await prisma.notification.updateMany({
          where: {
            id: { in: data.notificationIds },
            organizationId,
            userId: userId || undefined,
          },
          data: { read: true },
        });
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error }, { status: 400 });
      }
      return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
  }
);