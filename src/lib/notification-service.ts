import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class NotificationService {
  static async createStockLowAlert(
    organizationId: string,
    productId: string,
    currentStock: number,
    minStock: number,
    locationName: string
  ) {
    // Trouver les gestionnaires et propriétaires
    const managers = await prisma.organizationMember.findMany({
      where: {
        organizationId,
        active: true,
        role: {
          name: { in: ["Propriétaire", "Gestionnaire"] },
        },
      },
      include: { user: true },
    });

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { name: true, sku: true },
    });

    if (!product) return;

    // Créer notifications pour chaque gestionnaire
    for (const manager of managers) {
      await prisma.notification.create({
        data: {
          userId: manager.userId,
          organizationId,
          type: "STOCK_LOW",
          title: "Stock bas détecté",
          message: `Le produit "${product.name}" (${product.sku}) a un stock de ${currentStock} unités dans ${locationName}. Seuil minimum: ${minStock}`,
          priority: currentStock === 0 ? "URGENT" : "HIGH",
        },
      });
    }
  }

  static async createSaleCompletedNotification(
    organizationId: string,
    saleId: string,
    amount: number,
    customerName?: string
  ) {
    const managers = await prisma.organizationMember.findMany({
      where: {
        organizationId,
        active: true,
        role: {
          name: { in: ["Propriétaire", "Gestionnaire"] },
        },
      },
    });

    for (const manager of managers) {
      await prisma.notification.create({
        data: {
          userId: manager.userId,
          organizationId,
          type: "SALE_COMPLETED",
          title: "Nouvelle vente",
          message: `Vente de ${amount}€ ${customerName ? `pour ${customerName}` : ""}`,
          priority: amount > 1000 ? "HIGH" : "MEDIUM",
        },
      });
    }
  }

  static async createOrderReceivedNotification(
    organizationId: string,
    orderId: string,
    supplierName: string
  ) {
    const managers = await prisma.organizationMember.findMany({
      where: {
        organizationId,
        active: true,
        role: {
          name: { in: ["Propriétaire", "Gestionnaire", "Magasinier"] },
        },
      },
    });

    for (const manager of managers) {
      await prisma.notification.create({
        data: {
          userId: manager.userId,
          organizationId,
          type: "ORDER_RECEIVED",
          title: "Commande reçue",
          message: `Commande ${orderId} reçue de ${supplierName}`,
          priority: "MEDIUM",
        },
      });
    }
  }

  static async checkAndCreateStockAlerts(organizationId: string) {
    const lowStockProducts = await prisma.stock.findMany({
      where: {
        organizationId,
        quantity: {
          lte: prisma.product.fields.minStock,
        },
      },
      include: {
        product: { select: { name: true, sku: true, minStock: true } },
        store: { select: { name: true } },
        warehouse: { select: { name: true } },
      },
    });

    for (const stock of lowStockProducts) {
      const locationName = stock.store?.name || stock.warehouse?.name || "Localisation inconnue";
      
      await this.createStockLowAlert(
        organizationId,
        stock.productId,
        stock.quantity,
        stock.product.minStock,
        locationName
      );
    }
  }
}