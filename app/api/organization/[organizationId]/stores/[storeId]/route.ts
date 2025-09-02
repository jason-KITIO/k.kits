import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"
import { storeUpdateSchema } from "@/schema/store-schema";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";


// GET - Lire une boutique (permission ORG_SETTINGS)
export const GET = withPermission(PERMISSIONS.ORG_SETTINGS)(
  async (req: NextRequest, { params }: any) => {
    const { organizationId, storeId } = await params;

    try {
      const store = await prisma.store.findFirst({
        where: { id: storeId, organizationId },
      });
      if (!store) {
        return NextResponse.json(
          { error: "Boutique non trouvée" },
          { status: 404 }
        );
      }
      return NextResponse.json(store);
    } catch (error) {
      console.error("Erreur GET store", error);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }
);

// PUT - Modifier une boutique (permission ORG_SETTINGS)
export const PUT = withPermission(PERMISSIONS.ORG_SETTINGS)(
  async (req: NextRequest, { params }: any) => {
    const { organizationId, storeId } = await params;

    try {
      const body = await req.json();
      const parsed = storeUpdateSchema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
      }

      const existingStore = await prisma.store.findFirst({
        where: { id: storeId, organizationId },
      });
      if (!existingStore) {
        return NextResponse.json(
          { error: "Boutique non trouvée" },
          { status: 404 }
        );
      }

      const updatedStore = await prisma.store.update({
        where: { id: storeId },
        data: parsed.data,
      });

      return NextResponse.json(updatedStore);
    } catch (error) {
      console.error("Erreur PUT store", error);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }
);

// DELETE - Supprimer une boutique (permission ORG_SETTINGS)
export const DELETE = withPermission(PERMISSIONS.ORG_SETTINGS)(
  async (req: NextRequest, { params }: any) => {
    const { organizationId, storeId } = await params;

    try {
      const existingStore = await prisma.store.findFirst({
        where: { id: storeId, organizationId },
      });

      if (!existingStore) {
        return NextResponse.json(
          { error: "Boutique non trouvée" },
          { status: 404 }
        );
      }

      await prisma.store.delete({
        where: { id: storeId },
      });

      return new Response(null, { status: 204 });
    } catch (error) {
      console.error("Erreur DELETE store", error);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }
);
