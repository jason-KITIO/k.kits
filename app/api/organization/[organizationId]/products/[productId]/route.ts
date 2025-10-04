import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { productEditSchema } from "@/schema/product.schema";

export const PUT = withPermission(PERMISSIONS.PRODUCT_UPDATE)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string; productId: string }> }
  ) => {
    const { organizationId, productId } = await params;

    try {
      const json = await req.json();
      console.log('Data received:', json);
      const data = productEditSchema.parse(json);
      console.log('Data after validation:', data);

      const updateData = {
        ...data,
        color: data.color || "#FFFFFF",
        categoryId: data.categoryId === "" ? null : data.categoryId,
        supplierId: data.supplierId === "" ? null : data.supplierId,
      };
      
      const product = await prisma.product.update({
        where: { id: productId, organizationId },
        data: updateData,
        include: { category: true, supplier: true },
      });

      return NextResponse.json(product);
    } catch (error) {
      console.error('Error updating product:', error);
      if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error }, { status: 400 });
      }
      return NextResponse.json({ 
        error: "Erreur interne", 
        details: error instanceof Error ? error.message : "Erreur inconnue" 
      }, { status: 500 });
    }
  }
);

export const DELETE = withPermission(PERMISSIONS.PRODUCT_DELETE)(
  async (
    _req: NextRequest,
    { params }: { params: Promise<{ organizationId: string; productId: string }> }
  ) => {
    const { organizationId, productId } = await params;

    await prisma.product.update({
      where: { id: productId, organizationId },
      data: { active: false },
    });

    return NextResponse.json({ success: true });
  }
);