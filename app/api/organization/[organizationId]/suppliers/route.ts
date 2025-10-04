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
    { params }: { params: Promise<{ organizationId: string }> }
  ) => {
    const { organizationId } = await params;

    const suppliers = await prisma.supplier.findMany({
      where: { organizationId },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(suppliers);
  }
);

export const POST = withPermission(PERMISSIONS.PRODUCT_CREATE)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string }> }
  ) => {
    const { organizationId } = await params;

    try {
      const json = await req.json();
      const data = supplierCreateSchema.parse(json);

      const supplier = await prisma.supplier.create({
        data: {
          ...data,
          organizationId,
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