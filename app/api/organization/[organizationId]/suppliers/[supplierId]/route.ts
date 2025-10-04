import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import { z } from "zod";
import prisma from "@/lib/prisma";

const supplierUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  contactPerson: z.string().optional(),
  taxNumber: z.string().optional(),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
  active: z.boolean().optional(),
});

export const PUT = withPermission(PERMISSIONS.PRODUCT_UPDATE)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string; supplierId: string }> }
  ) => {
    const { organizationId, supplierId } = await params;

    try {
      const json = await req.json();
      const data = supplierUpdateSchema.parse(json);

      const supplier = await prisma.supplier.update({
        where: { id: supplierId, organizationId },
        data,
      });

      return NextResponse.json(supplier);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error }, { status: 400 });
      }
      return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
  }
);

export const DELETE = withPermission(PERMISSIONS.PRODUCT_DELETE)(
  async (
    _req: NextRequest,
    { params }: { params: Promise<{ organizationId: string; supplierId: string }> }
  ) => {
    const { organizationId, supplierId } = await params;

    await prisma.supplier.update({
      where: { id: supplierId, organizationId },
      data: { active: false },
    });

    return NextResponse.json({ success: true });
  }
);