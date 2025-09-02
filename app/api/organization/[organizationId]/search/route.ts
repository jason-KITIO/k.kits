import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import prisma from "@/lib/prisma"



export const GET = withPermission(PERMISSIONS.PRODUCT_READ)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string }> }
  ) => {
    const { organizationId } = await params;
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type") || "products";

    if (!query) {
      return NextResponse.json({ error: "Paramètre de recherche requis" }, { status: 400 });
    }

    try {
      switch (type) {
        case "products":
          const products = await prisma.product.findMany({
            where: {
              organizationId,
              active: true,
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { sku: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
              ],
            },
            include: {
              category: { select: { name: true } },
              supplier: { select: { name: true } },
              stocks: {
                select: {
                  quantity: true,
                  store: { select: { name: true } },
                  warehouse: { select: { name: true } },
                },
              },
            },
            take: 20,
          });
          return NextResponse.json(products);

        case "customers":
          const customers = await prisma.customer.findMany({
            where: {
              organizationId,
              active: true,
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
                { phone: { contains: query, mode: "insensitive" } },
              ],
            },
            take: 20,
          });
          return NextResponse.json(customers);

        case "suppliers":
          const suppliers = await prisma.supplier.findMany({
            where: {
              organizationId,
              active: true,
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
                { contactPerson: { contains: query, mode: "insensitive" } },
              ],
            },
            take: 20,
          });
          return NextResponse.json(suppliers);

        default:
          return NextResponse.json({ error: "Type de recherche non supporté" }, { status: 400 });
      }
    } catch (error) {
      return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
  }
);