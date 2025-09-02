import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import { z } from "zod";
import prisma from "@/lib/prisma"
import { categoryCreateSchema } from "@/schema/category.schema";

export const GET = withPermission(PERMISSIONS.PRODUCT_READ)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string; storeId: string }> }
  ) => {
    const { organizationId, storeId } = await params;

    // Valider que le store appartient bien à l'organization
    const store = await prisma.store.findFirst({
      where: { id: storeId, organizationId, active: true },
    });
    if (!store) {
      return NextResponse.json(
        { error: "Boutique introuvable ou non associée à l'organisation" },
        { status: 404 }
      );
    }

    // Récupérer catégories racines (parentId = null) pour l'organisation
    const categories = await prisma.category.findMany({
      where: { organizationId, parentId: null, active: true },
      include: { subCategories: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(categories);
  }
);

export const POST = withPermission(PERMISSIONS.PRODUCT_CREATE)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string; storeId: string }> }
  ) => {
    const { organizationId, storeId } = await params;

    const store = await prisma.store.findFirst({
      where: { id: storeId, organizationId, active: true },
    });
    if (!store) {
      return NextResponse.json(
        { error: "Boutique introuvable ou non associée à l'organisation" },
        { status: 404 }
      );
    }

    try {
      const json = await req.json();
      const data = categoryCreateSchema.parse(json);

      const category = await prisma.category.create({
        data: {
          ...data,
          organizationId,
          active: data.active ?? true,
        },
      });

      return NextResponse.json(category, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error }, { status: 400 });
      }
      return NextResponse.json({ error: "Erreur inconnue" }, { status: 500 });
    }
  }
);
