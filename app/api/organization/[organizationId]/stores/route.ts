import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"

import { storeCreateSchema } from "@/schema/store-schema";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";


// GET - Lire les boutiques (permission ORG_SETTINGS)
export const GET = withPermission(PERMISSIONS.ORG_SETTINGS)(
  async (req: NextRequest, { params }: any) => {
    const { organizationId } = await params;

    try {
      const stores = await prisma.store.findMany({
        where: { organizationId, active: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(stores);
    } catch (error) {
      console.error("Erreur GET stores", error);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }
);

// POST - Créer une boutique (permission ORG_SETTINGS)
export const POST = withPermission(PERMISSIONS.ORG_SETTINGS)(
  async (req: NextRequest, { params }: any) => {
    const { organizationId } = await params;

    try {
      const body = await req.json();
      const parsed = storeCreateSchema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
      }

      const newStore = await prisma.store.create({
        data: {
          ...parsed.data,
          organizationId,
        },
      });

      return NextResponse.json(newStore, { status: 201 });
    } catch (error) {
      console.error("Erreur POST store", error);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }
);
