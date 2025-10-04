import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string; storeId: string; requestId: string }> }
) {
  const { organizationId, storeId, requestId } = await params;
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const stockRequest = await prisma.stockMovementRequest.findUnique({
      where: { id: requestId },
      include: { product: true },
    });

    if (!stockRequest) {
      return NextResponse.json({ error: "Requête non trouvée" }, { status: 404 });
    }

    if (stockRequest.status !== "PENDING") {
      return NextResponse.json({ error: "Requête déjà traitée" }, { status: 400 });
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Diminuer le stock principal
      const stock = await tx.stock.findFirst({
        where: {
          productId: stockRequest.productId,
          storeId,
          organizationId,
          warehouseId: null,
        },
      });

      if (stock) {
        await tx.stock.update({
          where: { id: stock.id },
          data: {
            quantity: { decrement: stockRequest.quantity },
          },
        });
      } else {
        throw new Error("Stock non trouvé pour cette boutique");
      }

      // Créer ou mettre à jour le stock employé
      await tx.employeeStock.upsert({
        where: {
          employeeId_productId_storeId_organizationId: {
            employeeId: stockRequest.toId,
            productId: stockRequest.productId,
            storeId,
            organizationId,
          },
        },
        update: {
          quantity: { increment: stockRequest.quantity },
          lastUpdated: new Date(),
        },
        create: {
          employeeId: stockRequest.toId,
          productId: stockRequest.productId,
          storeId,
          organizationId,
          quantity: stockRequest.quantity,
        },
      });

      // Créer le mouvement de stock
      await tx.stockMovement.create({
        data: {
          productId: stockRequest.productId,
          fromStoreId: storeId,
          quantity: -stockRequest.quantity,
          type: "EMPLOYEE_REQUEST",
          reference: `REQ-${stockRequest.id}`,
          reason: `Transfert vers employé: ${stockRequest.reason}`,
          userId: user.id,
          organizationId,
        },
      });

      // Mettre à jour la requête
      await tx.stockMovementRequest.update({
        where: { id: requestId },
        data: {
          status: "COMPLETED",
          approvedBy: user.id,
        },
      });
    });

    return NextResponse.json({ message: "Requête approuvée avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'approbation:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}