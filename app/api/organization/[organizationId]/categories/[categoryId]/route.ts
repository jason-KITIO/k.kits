import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { categoryUpdateSchema } from "@/schema/category.schema";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string; categoryId: string }> }
) {
  const { organizationId, categoryId } = await params;
  try {
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        organizationId,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Catégorie non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la catégorie" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string; categoryId: string }> }
) {
  const { organizationId, categoryId } = await params;
  try {
    const body = await request.json();
    const validatedData = categoryUpdateSchema.parse(body);

    const category = await prisma.category.update({
      where: {
        id: categoryId,
        organizationId,
      },
      data: validatedData,
    });

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la catégorie" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string; categoryId: string }> }
) {
  const { organizationId, categoryId } = await params;
  try {
    await prisma.category.delete({
      where: {
        id: categoryId,
        organizationId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la catégorie" },
      { status: 500 }
    );
  }
}