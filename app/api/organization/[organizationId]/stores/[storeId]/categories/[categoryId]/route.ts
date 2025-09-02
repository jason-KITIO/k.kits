import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import prisma from "@/lib/prisma"
import { z } from "zod";
import { categoryUpdateSchema } from "@/schema/category.schema";

export const PUT = withPermission(PERMISSIONS.PRODUCT_UPDATE)(
  async (
    req: NextRequest,
    {
      params,
    }: {
      params: Promise<{
        organizationId: string;
        storeId: string;
        categoryId: string;
      }>;
    }
  ) => {
    const { organizationId, storeId, categoryId } = await params;

    // Vérification que le store appartient bien à l'organisation
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
      const data = categoryUpdateSchema.parse(json);

      const updateResult = await prisma.category.updateMany({
        where: {
          id: categoryId,
          organizationId: store.organizationId,
        },
        data,
      });

      if (updateResult.count === 0) {
        return NextResponse.json(
          { error: "Catégorie introuvable ou accès refusé" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: "Catégorie mise à jour avec succès",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error }, { status: 400 });
      }
      return NextResponse.json({ error: "Erreur inconnue" }, { status: 500 });
    }
  }
);

export const DELETE = withPermission(PERMISSIONS.PRODUCT_DELETE)(
  async (
    _req: NextRequest,
    {
      params,
    }: {
      params: Promise<{
        organizationId: string;
        storeId: string;
        categoryId: string;
      }>;
    }
  ) => {
    const { organizationId, storeId, categoryId } = await params;

    // Vérification que le store appartient bien à l'organisation
    const store = await prisma.store.findFirst({
      where: { id: storeId, organizationId, active: true },
    });
    if (!store) {
      return NextResponse.json(
        { error: "Boutique introuvable ou non associée à l'organisation" },
        { status: 404 }
      );
    }

    const deleteResult = await prisma.category.deleteMany({
      where: {
        id: categoryId,
        organizationId: store.organizationId,
      },
    });

    if (deleteResult.count === 0) {
      return NextResponse.json(
        { error: "Catégorie introuvable ou accès refusé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Catégorie supprimée avec succès" });
  }
);
