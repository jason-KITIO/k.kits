import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import prisma from "@/lib/prisma"
import { z } from "zod";
import { customerCreateSchema } from "@/schema/customer.schema";

export const GET = withPermission(PERMISSIONS.CUSTOMER_READ)(
  async (
    _req: NextRequest,
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

    // Récupérer tous les clients de l'organisation
    const customers = await prisma.customer.findMany({
      where: { organizationId: store.organizationId, active: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(customers);
  }
);

export const POST = withPermission(PERMISSIONS.CUSTOMER_CREATE)(
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
      const data = customerCreateSchema.parse(json);

      const customer = await prisma.customer.create({
        data: {
          ...data,
          organizationId: store.organizationId,
          active: data.active ?? true,
        },
      });

      return NextResponse.json(customer, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error }, { status: 400 });
      }
      return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
  }
);
