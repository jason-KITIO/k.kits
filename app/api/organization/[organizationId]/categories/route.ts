import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { categoryCreateSchema } from "@/schema/category.schema";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  try {
    const { organizationId } = await params;
    const categories = await prisma.category.findMany({
      where: {
        organizationId: organizationId,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(categories || []);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des catégories" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  try {
    const { organizationId } = await params;
    const body = await request.json();
    const validatedData = categoryCreateSchema.parse(body);

    const category = await prisma.category.create({
      data: {
        ...validatedData,
        organizationId: organizationId,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création de la catégorie" },
      { status: 500 }
    );
  }
}
