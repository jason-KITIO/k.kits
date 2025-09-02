import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import { z } from "zod";
import prisma from "@/lib/prisma"

// Schéma Zod pour la création fournisseur
const supplierCreateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  contactPerson: z.string().optional(),
  taxNumber: z.string().optional(),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
  active: z.boolean().optional().default(true),
});

export const GET = withPermission(PERMISSIONS.PRODUCT_READ)(
  async (
    _req: NextRequest,
    { params }: { params: Promise<{ organizationId: string; storeId: string }> }
  ) => {
    const { organizationId, storeId } = await params;

    // Vérifier que le store appartient à l'organisation
    const store = await prisma.store.findFirst({
      where: { id: storeId, organizationId, active: true },
    });
    if (!store) {
      return NextResponse.json(
        { error: "Boutique introuvable ou non associée à l’organisation" },
        { status: 404 }
      );
    }

    // Liste des fournisseurs de l’organisation
    const suppliers = await prisma.supplier.findMany({
      where: { organizationId: store.organizationId, active: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(suppliers);
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
        { error: "Boutique introuvable ou non associée à l’organisation" },
        { status: 404 }
      );
    }

    try {
      const json = await req.json();
      const data = supplierCreateSchema.parse(json);

      const supplier = await prisma.supplier.create({
        data: {
          ...data,
          organizationId: store.organizationId,
          active: data.active ?? true,
        },
      });

      return NextResponse.json(supplier, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error }, { status: 400 });
      }
      return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
  }
);
