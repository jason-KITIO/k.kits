import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/route-protection";
import { PERMISSIONS } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { reportRequestSchema } from "@/schema/report.schema";

export const GET = withPermission(PERMISSIONS.REPORT_READ)(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ organizationId: string }> }
  ) => {
    const { organizationId } = await params;
    const { searchParams } = new URL(req.url);
    
    try {
      const queryParams = Object.fromEntries(searchParams.entries());
      
      // Conversion des paramètres string en types appropriés
      const transformedParams = {
        ...queryParams,
        includeDetails: queryParams.includeDetails === 'true',
      };
      
      const validatedParams = reportRequestSchema.parse(transformedParams);
      
      const { type, format, startDate, endDate, storeId, warehouseId } = validatedParams;

      // Filtre de date
      const dateFilter = startDate && endDate ? {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      } : {};

      // Filtres additionnels
      const additionalFilters: any = {};
      if (storeId) additionalFilters.storeId = storeId;
      if (warehouseId) additionalFilters.warehouseId = warehouseId;

      let data: any;
      let filename: string;

      switch (type) {
        case "sales":
          data = await getSalesExportData(organizationId, dateFilter, additionalFilters);
          filename = `rapport-ventes-${new Date().toISOString().split('T')[0]}`;
          break;
        
        case "stock":
          data = await getStockExportData(organizationId, additionalFilters);
          filename = `rapport-stock-${new Date().toISOString().split('T')[0]}`;
          break;
        
        case "movements":
          data = await getMovementsExportData(organizationId, dateFilter, additionalFilters);
          filename = `rapport-mouvements-${new Date().toISOString().split('T')[0]}`;
          break;
        
        case "profit":
          data = await getProfitExportData(organizationId, dateFilter, additionalFilters);
          filename = `rapport-rentabilite-${new Date().toISOString().split('T')[0]}`;
          break;

        default:
          return NextResponse.json({ error: "Type de rapport non supporté" }, { status: 400 });
      }

      switch (format) {
        case "csv":
          const csv = convertToCSV(data);
          return new NextResponse(csv, {
            headers: {
              'Content-Type': 'text/csv',
              'Content-Disposition': `attachment; filename="${filename}.csv"`,
            },
          });

        case "excel":
          const excelCsv = convertToCSV(data);
          return new NextResponse(excelCsv, {
            headers: {
              'Content-Type': 'application/vnd.ms-excel',
              'Content-Disposition': `attachment; filename="${filename}.xls"`,
            },
          });

        case "pdf":
          return NextResponse.json({ error: "Export PDF en cours de développement" }, { status: 501 });

        default:
          return NextResponse.json(data);
      }
    } catch (error) {
      console.error("Erreur export rapport:", error);
      return NextResponse.json({ error: "Erreur lors de l'export" }, { status: 500 });
    }
  }
);

async function getSalesExportData(organizationId: string, dateFilter: any, additionalFilters: any) {
  const sales = await prisma.sale.findMany({
    where: { organizationId, ...dateFilter, ...additionalFilters },
    include: {
      store: { select: { name: true } },
      customer: { select: { name: true } },
      items: { 
        include: { 
          product: { select: { name: true, sku: true } } 
        } 
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return sales.flatMap(sale => 
    sale.items.map(item => ({
      "Date": sale.createdAt.toLocaleDateString('fr-FR'),
      "Boutique": sale.store.name,
      "Client": sale.customer?.name || "Client anonyme",
      "Produit": item.product.name,
      "SKU": item.product.sku,
      "Quantité": item.quantity,
      "Prix unitaire": Number(item.unitPrice),
      "Remise (%)": Number(item.discount),
      "Total ligne": Number(item.totalAmount),
      "Total vente": Number(sale.totalAmount),
      "Statut": sale.status
    }))
  );
}

async function getStockExportData(organizationId: string, additionalFilters: any) {
  const stocks = await prisma.stock.findMany({
    where: { organizationId, ...additionalFilters },
    include: {
      product: { 
        select: { 
          name: true, 
          sku: true, 
          minStock: true, 
          unitPrice: true,
          category: { select: { name: true } }
        } 
      },
      store: { select: { name: true } },
      warehouse: { select: { name: true } },
    },
  });

  return stocks.map(stock => ({
    "Produit": stock.product.name,
    "SKU": stock.product.sku,
    "Catégorie": stock.product.category?.name || "Sans catégorie",
    "Localisation": stock.store?.name || stock.warehouse?.name || "Non défini",
    "Type localisation": stock.storeId ? "Boutique" : "Entrepôt",
    "Quantité disponible": stock.quantity,
    "Quantité réservée": stock.reservedQuantity,
    "Stock minimum": stock.product.minStock,
    "Prix unitaire": Number(stock.product.unitPrice),
    "Valeur stock": stock.quantity * Number(stock.product.unitPrice),
    "Statut": stock.quantity <= stock.product.minStock ? "Stock bas" : "OK",
    "Dernière MAJ": stock.lastUpdated.toLocaleDateString('fr-FR')
  }));
}

async function getMovementsExportData(organizationId: string, dateFilter: any, additionalFilters: any) {
  const movements = await prisma.stockMovement.findMany({
    where: { organizationId, ...dateFilter, ...additionalFilters },
    include: {
      product: { select: { name: true, sku: true } },
      user: { select: { firstName: true, lastName: true } },
      fromStore: { select: { name: true } },
      toStore: { select: { name: true } },
      fromWarehouse: { select: { name: true } },
      toWarehouse: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return movements.map(movement => ({
    "Date": movement.createdAt.toLocaleDateString('fr-FR'),
    "Produit": movement.product.name,
    "SKU": movement.product.sku,
    "Type": movement.type,
    "Quantité": movement.quantity,
    "Origine": movement.fromStore?.name || movement.fromWarehouse?.name || "N/A",
    "Destination": movement.toStore?.name || movement.toWarehouse?.name || "N/A",
    "Utilisateur": `${movement.user.firstName || ""} ${movement.user.lastName || ""}`.trim(),
    "Référence": movement.reference || "",
    "Motif": movement.reason || ""
  }));
}

async function getProfitExportData(organizationId: string, dateFilter: any, additionalFilters: any) {
  const sales = await prisma.sale.findMany({
    where: { organizationId, ...dateFilter, ...additionalFilters },
    include: {
      items: {
        include: {
          product: { select: { name: true, sku: true, costPrice: true } }
        }
      }
    }
  });

  return sales.flatMap(sale => 
    sale.items.map(item => {
      const revenue = Number(item.totalAmount);
      const cost = item.quantity * Number(item.product.costPrice);
      const profit = revenue - cost;
      const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

      return {
        "Date": sale.createdAt.toLocaleDateString('fr-FR'),
        "Produit": item.product.name,
        "SKU": item.product.sku,
        "Quantité": item.quantity,
        "Prix de vente": Number(item.unitPrice),
        "Prix de revient": Number(item.product.costPrice),
        "Chiffre d'affaires": revenue,
        "Coût total": cost,
        "Bénéfice": profit,
        "Marge (%)": margin.toFixed(2)
      };
    })
  );
}

function convertToCSV(data: any[]): string {
  if (!data.length) return "";
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(",")
    )
  ].join("\n");
  
  return csvContent;
}