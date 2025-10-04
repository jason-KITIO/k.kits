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
      // Validation des paramètres
      const queryParams = Object.fromEntries(searchParams.entries());
      
      // Conversion des types pour les paramètres booléens
      const processedParams = {
        ...queryParams,
        includeDetails: queryParams.includeDetails === 'true'
      };
      
      const validatedParams = reportRequestSchema.parse(processedParams);
      
      const { type, startDate, endDate, storeId, warehouseId, categoryId, productId, customerId, groupBy } = validatedParams;

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
      if (categoryId) additionalFilters.categoryId = categoryId;
      if (productId) additionalFilters.productId = productId;
      if (customerId) additionalFilters.customerId = customerId;

      switch (type) {
        case "sales":
          return await generateSalesReport(organizationId, dateFilter, additionalFilters, groupBy);
        
        case "stock":
          return await generateStockReport(organizationId, additionalFilters);
        
        case "movements":
          return await generateMovementReport(organizationId, dateFilter, additionalFilters, groupBy);
        
        case "profit":
          return await generateProfitReport(organizationId, dateFilter, additionalFilters, groupBy);
        
        case "customers":
          return await generateCustomerReport(organizationId, dateFilter, additionalFilters);
        
        case "products":
          return await generateProductReport(organizationId, dateFilter, additionalFilters);
        
        case "financial":
          return await generateFinancialReport(organizationId, dateFilter, additionalFilters);
        
        case "performance":
          return await generatePerformanceReport(organizationId, dateFilter, additionalFilters);

        default:
          return NextResponse.json({ error: "Type de rapport non supporté" }, { status: 400 });
      }
    } catch (error) {
      console.error("Erreur génération rapport:", error);
      return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
  }
);

// Rapport des ventes
async function generateSalesReport(organizationId: string, dateFilter: any, additionalFilters: any, groupBy?: string) {
  const salesData = await prisma.sale.findMany({
    where: { organizationId, ...dateFilter, ...additionalFilters },
    include: {
      store: { select: { id: true, name: true } },
      customer: { select: { id: true, name: true } },
      items: { 
        include: { 
          product: { 
            select: { id: true, name: true, categoryId: true, category: { select: { name: true } } } 
          } 
        } 
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalSales = salesData.length;
  const totalRevenue = salesData.reduce((sum, sale) => sum + Number(sale.totalAmount), 0);
  const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

  // Top produits
  const productSales = new Map();
  salesData.forEach(sale => {
    sale.items.forEach(item => {
      const key = item.product.id;
      if (!productSales.has(key)) {
        productSales.set(key, {
          productId: item.product.id,
          productName: item.product.name,
          quantity: 0,
          revenue: 0
        });
      }
      const current = productSales.get(key);
      current.quantity += item.quantity;
      current.revenue += Number(item.totalAmount);
    });
  });

  const topProducts = Array.from(productSales.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // Ventes par boutique
  const storeSales = new Map();
  salesData.forEach(sale => {
    const key = sale.store.id;
    if (!storeSales.has(key)) {
      storeSales.set(key, {
        storeId: sale.store.id,
        storeName: sale.store.name,
        sales: 0,
        revenue: 0
      });
    }
    const current = storeSales.get(key);
    current.sales += 1;
    current.revenue += Number(sale.totalAmount);
  });

  const salesByStore = Array.from(storeSales.values());

  const report = {
    totalSales,
    totalRevenue,
    averageOrderValue,
    salesCount: totalSales,
    topProducts,
    salesByPeriod: [], // À implémenter selon groupBy
    salesByStore
  };

  return NextResponse.json(report);
}

// Rapport des stocks
async function generateStockReport(organizationId: string, additionalFilters: any) {
  const stockData = await prisma.stock.findMany({
    where: { organizationId, ...additionalFilters },
    include: {
      product: { 
        select: { 
          id: true, 
          name: true, 
          minStock: true, 
          unitPrice: true, 
          categoryId: true,
          category: { select: { id: true, name: true } }
        } 
      },
      store: { select: { id: true, name: true } },
      warehouse: { select: { id: true, name: true } },
    },
  });

  const totalProducts = new Set(stockData.map(s => s.productId)).size;
  const totalStockValue = stockData.reduce((sum, stock) => 
    sum + (stock.quantity * Number(stock.product.unitPrice)), 0
  );

  // Articles en stock bas
  const lowStockItems = stockData
    .filter(stock => stock.quantity <= stock.product.minStock)
    .map(stock => ({
      productId: stock.product.id,
      productName: stock.product.name,
      currentStock: stock.quantity,
      minStock: stock.product.minStock,
      location: stock.store?.name || stock.warehouse?.name || "Non défini"
    }));

  // Stock par catégorie
  const categoryStock = new Map();
  stockData.forEach(stock => {
    const categoryId = stock.product.categoryId || "uncategorized";
    const categoryName = stock.product.category?.name || "Sans catégorie";
    
    if (!categoryStock.has(categoryId)) {
      categoryStock.set(categoryId, {
        categoryId,
        categoryName,
        totalQuantity: 0,
        totalValue: 0
      });
    }
    
    const current = categoryStock.get(categoryId);
    current.totalQuantity += stock.quantity;
    current.totalValue += stock.quantity * Number(stock.product.unitPrice);
  });

  // Stock par localisation
  const locationStock = new Map();
  stockData.forEach(stock => {
    const locationId = stock.storeId || stock.warehouseId || "unknown";
    const locationName = stock.store?.name || stock.warehouse?.name || "Non défini";
    const locationType = stock.storeId ? "store" : "warehouse";
    
    if (!locationStock.has(locationId)) {
      locationStock.set(locationId, {
        locationId,
        locationName,
        locationType,
        totalQuantity: 0,
        totalValue: 0
      });
    }
    
    const current = locationStock.get(locationId);
    current.totalQuantity += stock.quantity;
    current.totalValue += stock.quantity * Number(stock.product.unitPrice);
  });

  const report = {
    totalProducts,
    totalStockValue,
    lowStockItems,
    stockByCategory: Array.from(categoryStock.values()),
    stockByLocation: Array.from(locationStock.values())
  };

  return NextResponse.json(report);
}

// Rapport des mouvements
async function generateMovementReport(organizationId: string, dateFilter: any, additionalFilters: any, groupBy?: string) {
  const movementData = await prisma.stockMovement.findMany({
    where: { organizationId, ...dateFilter, ...additionalFilters },
    include: {
      product: { select: { id: true, name: true } },
      user: { select: { firstName: true, lastName: true } },
      fromStore: { select: { name: true } },
      toStore: { select: { name: true } },
      fromWarehouse: { select: { name: true } },
      toWarehouse: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalMovements = movementData.length;

  // Mouvements par type
  const movementsByType = new Map();
  movementData.forEach(movement => {
    const type = movement.type;
    if (!movementsByType.has(type)) {
      movementsByType.set(type, { type, count: 0, quantity: 0 });
    }
    const current = movementsByType.get(type);
    current.count += 1;
    current.quantity += Math.abs(movement.quantity);
  });

  // Produits les plus déplacés
  const productMovements = new Map();
  movementData.forEach(movement => {
    const productId = movement.product.id;
    if (!productMovements.has(productId)) {
      productMovements.set(productId, {
        productId,
        productName: movement.product.name,
        totalQuantity: 0,
        movementCount: 0
      });
    }
    const current = productMovements.get(productId);
    current.totalQuantity += Math.abs(movement.quantity);
    current.movementCount += 1;
  });

  const topMovedProducts = Array.from(productMovements.values())
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 10);

  const report = {
    totalMovements,
    movementsByType: Array.from(movementsByType.values()),
    movementsByPeriod: [], // À implémenter selon groupBy
    topMovedProducts
  };

  return NextResponse.json(report);
}

// Rapport de rentabilité
async function generateProfitReport(organizationId: string, dateFilter: any, additionalFilters: any, groupBy?: string) {
  const salesData = await prisma.sale.findMany({
    where: { organizationId, ...dateFilter, ...additionalFilters },
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true, costPrice: true } }
        }
      }
    }
  });

  let totalRevenue = 0;
  let totalCost = 0;
  const productProfits = new Map();

  salesData.forEach(sale => {
    sale.items.forEach(item => {
      const revenue = Number(item.totalAmount);
      const cost = item.quantity * Number(item.product.costPrice);
      
      totalRevenue += revenue;
      totalCost += cost;

      const productId = item.product.id;
      if (!productProfits.has(productId)) {
        productProfits.set(productId, {
          productId,
          productName: item.product.name,
          revenue: 0,
          cost: 0,
          profit: 0,
          margin: 0
        });
      }
      
      const current = productProfits.get(productId);
      current.revenue += revenue;
      current.cost += cost;
      current.profit = current.revenue - current.cost;
      current.margin = current.revenue > 0 ? (current.profit / current.revenue) * 100 : 0;
    });
  });

  const grossProfit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  const report = {
    totalRevenue,
    totalCost,
    grossProfit,
    profitMargin,
    profitByProduct: Array.from(productProfits.values())
      .sort((a, b) => b.profit - a.profit),
    profitByPeriod: [] // À implémenter selon groupBy
  };

  return NextResponse.json(report);
}

// Rapport clients
async function generateCustomerReport(organizationId: string, dateFilter: any, additionalFilters: any) {
  const customerData = await prisma.customer.findMany({
    where: { organizationId, ...additionalFilters },
    include: {
      sales: {
        where: dateFilter,
        select: {
          id: true,
          totalAmount: true,
          createdAt: true
        }
      }
    }
  });

  const totalCustomers = customerData.length;
  const newCustomers = customerData.filter(customer => 
    dateFilter.createdAt ? customer.createdAt >= dateFilter.createdAt.gte : true
  ).length;
  const returningCustomers = customerData.filter(customer => customer.sales.length > 1).length;

  const topCustomers = customerData
    .map(customer => ({
      customerId: customer.id,
      customerName: customer.name,
      totalSpent: customer.sales.reduce((sum, sale) => sum + Number(sale.totalAmount), 0),
      orderCount: customer.sales.length,
      lastOrderDate: customer.sales.length > 0 
        ? customer.sales.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0].createdAt.toISOString()
        : null
    }))
    .filter(customer => customer.orderCount > 0)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 10);

  const report = {
    totalCustomers,
    newCustomers,
    returningCustomers,
    topCustomers,
    customersByPeriod: [] // À implémenter
  };

  return NextResponse.json(report);
}

// Rapport produits
async function generateProductReport(organizationId: string, dateFilter: any, additionalFilters: any) {
  const productData = await prisma.product.findMany({
    where: { organizationId, ...additionalFilters },
    include: {
      category: { select: { id: true, name: true } },
      stocks: {
        select: {
          quantity: true,
          store: { select: { name: true } },
          warehouse: { select: { name: true } }
        }
      },
      saleItems: {
        where: dateFilter,
        select: {
          quantity: true,
          totalAmount: true,
          sale: { select: { createdAt: true } }
        }
      }
    }
  });

  const totalProducts = productData.length;
  const activeProducts = productData.filter(p => p.active).length;
  const lowStockProducts = productData.filter(p => {
    const totalStock = p.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
    return totalStock <= p.minStock;
  }).length;
  const outOfStockProducts = productData.filter(p => {
    const totalStock = p.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
    return totalStock === 0;
  }).length;

  // Top produits vendeurs
  const topSellingProducts = productData
    .map(product => {
      const quantitySold = product.saleItems.reduce((sum, item) => sum + item.quantity, 0);
      const revenue = product.saleItems.reduce((sum, item) => sum + Number(item.totalAmount), 0);
      return {
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        quantitySold,
        revenue,
        category: product.category?.name
      };
    })
    .filter(p => p.quantitySold > 0)
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, 15);

  // Produits peu performants
  const lowPerformingProducts = productData
    .map(product => {
      const quantitySold = product.saleItems.reduce((sum, item) => sum + item.quantity, 0);
      const stockLevel = product.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
      const lastSale = product.saleItems.length > 0 
        ? Math.max(...product.saleItems.map(item => item.sale.createdAt.getTime()))
        : 0;
      const daysSinceLastSale = lastSale > 0 
        ? Math.floor((Date.now() - lastSale) / (1000 * 60 * 60 * 24))
        : 999;
      
      return {
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        quantitySold,
        stockLevel,
        daysSinceLastSale
      };
    })
    .filter(p => p.quantitySold < 5 || p.daysSinceLastSale > 30)
    .sort((a, b) => b.daysSinceLastSale - a.daysSinceLastSale)
    .slice(0, 15);

  // Analyse par catégorie
  const categoryMap = new Map();
  productData.forEach(product => {
    const categoryId = product.categoryId || "uncategorized";
    const categoryName = product.category?.name || "Sans catégorie";
    
    if (!categoryMap.has(categoryId)) {
      categoryMap.set(categoryId, {
        categoryId,
        categoryName,
        productCount: 0,
        totalRevenue: 0,
        totalPrice: 0
      });
    }
    
    const current = categoryMap.get(categoryId);
    current.productCount += 1;
    current.totalRevenue += product.saleItems.reduce((sum, item) => sum + Number(item.totalAmount), 0);
    current.totalPrice += Number(product.unitPrice);
  });

  const productsByCategory = Array.from(categoryMap.values())
    .map(cat => ({
      ...cat,
      averagePrice: cat.productCount > 0 ? cat.totalPrice / cat.productCount : 0
    }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue);

  // Analyse du stock
  const totalStockValue = productData.reduce((sum, product) => {
    const stockLevel = product.stocks.reduce((stockSum, stock) => stockSum + stock.quantity, 0);
    return sum + (stockLevel * Number(product.unitPrice));
  }, 0);
  
  const averageStockLevel = totalProducts > 0 
    ? productData.reduce((sum, product) => {
        return sum + product.stocks.reduce((stockSum, stock) => stockSum + stock.quantity, 0);
      }, 0) / totalProducts
    : 0;
  
  const stockTurnoverRate = totalStockValue > 0 
    ? productData.reduce((sum, product) => {
        const revenue = product.saleItems.reduce((itemSum, item) => itemSum + Number(item.totalAmount), 0);
        const stockValue = product.stocks.reduce((stockSum, stock) => stockSum + stock.quantity, 0) * Number(product.unitPrice);
        return sum + (stockValue > 0 ? revenue / stockValue : 0);
      }, 0) / totalProducts
    : 0;

  const report = {
    totalProducts,
    activeProducts,
    lowStockProducts,
    outOfStockProducts,
    topSellingProducts,
    lowPerformingProducts,
    productsByCategory,
    stockAnalysis: {
      totalStockValue,
      averageStockLevel,
      stockTurnoverRate
    }
  };

  return NextResponse.json(report);
}

// Rapport financier
async function generateFinancialReport(organizationId: string, dateFilter: any, additionalFilters: any) {
  // Données des ventes pour le chiffre d'affaires
  const salesData = await prisma.sale.findMany({
    where: { organizationId, ...dateFilter, ...additionalFilters },
    include: {
      items: {
        include: {
          product: { select: { costPrice: true } }
        }
      }
    }
  });

  // Calcul du chiffre d'affaires et des coûts
  let totalRevenue = 0;
  let totalCost = 0;
  const revenueByPeriod = new Map();

  salesData.forEach(sale => {
    const revenue = Number(sale.totalAmount);
    const cost = sale.items.reduce((sum, item) => 
      sum + (item.quantity * Number(item.product.costPrice)), 0
    );
    
    totalRevenue += revenue;
    totalCost += cost;

    // Groupement par mois pour l'évolution
    const period = sale.createdAt.toISOString().substring(0, 7);
    if (!revenueByPeriod.has(period)) {
      revenueByPeriod.set(period, { revenue: 0, expenses: 0, profit: 0 });
    }
    const current = revenueByPeriod.get(period);
    current.revenue += revenue;
    current.expenses += cost;
    current.profit = current.revenue - current.expenses;
  });

  // Simulation des dépenses opérationnelles (à adapter selon votre modèle)
  const operatingExpenses = totalRevenue * 0.15; // 15% du CA
  const totalExpenses = totalCost + operatingExpenses;
  const netIncome = totalRevenue - totalExpenses;
  const grossMargin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0;
  const operatingMargin = totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0;

  // Flux de trésorerie simulés
  const cashFlow = {
    operating: netIncome + (totalRevenue * 0.05), // Ajustement pour amortissements
    investing: -(totalRevenue * 0.08), // Investissements
    financing: totalRevenue * 0.02, // Financement
    net: 0
  };
  cashFlow.net = cashFlow.operating + cashFlow.investing + cashFlow.financing;

  // Répartition des dépenses par catégorie
  const expensesByCategory = [
    { category: "Coût des marchandises vendues", amount: totalCost, percentage: (totalCost / totalExpenses) * 100 },
    { category: "Frais opérationnels", amount: operatingExpenses, percentage: (operatingExpenses / totalExpenses) * 100 }
  ];

  // Métriques de rentabilité
  const profitabilityMetrics = {
    roi: totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0,
    roa: totalRevenue > 0 ? (netIncome / (totalRevenue * 0.7)) * 100 : 0, // Simulation actifs
    grossProfitMargin: grossMargin,
    netProfitMargin: operatingMargin
  };

  // Ratios financiers simulés
  const financialRatios = {
    currentRatio: 1.5, // Simulation
    quickRatio: 1.2,
    debtToEquity: 0.4,
    inventoryTurnover: totalRevenue > 0 ? totalCost / (totalRevenue * 0.2) : 0
  };

  const report = {
    totalRevenue,
    totalExpenses,
    netIncome,
    grossMargin,
    operatingMargin,
    cashFlow,
    revenueByPeriod: Array.from(revenueByPeriod.entries()).map(([period, data]) => ({
      period,
      ...data
    })),
    expensesByCategory,
    profitabilityMetrics,
    financialRatios
  };

  return NextResponse.json(report);
}

// Rapport de performance
async function generatePerformanceReport(organizationId: string, dateFilter: any, additionalFilters: any) {
  // Données actuelles
  const currentSales = await prisma.sale.findMany({
    where: { organizationId, ...dateFilter, ...additionalFilters },
    include: { items: true, customer: true }
  });

  // Données de la période précédente pour comparaison
  const previousPeriodFilter = {
    createdAt: {
      gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 jours avant
      lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)  // 30 jours avant
    }
  };
  
  const previousSales = await prisma.sale.findMany({
    where: { organizationId, ...previousPeriodFilter, ...additionalFilters },
    include: { items: true, customer: true }
  });

  // Calculs de croissance
  const currentRevenue = currentSales.reduce((sum, sale) => sum + Number(sale.totalAmount), 0);
  const previousRevenue = previousSales.reduce((sum, sale) => sum + Number(sale.totalAmount), 0);
  const revenueGrowth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
  const salesGrowth = previousSales.length > 0 ? ((currentSales.length - previousSales.length) / previousSales.length) * 100 : 0;

  // Clients uniques
  const currentCustomers = new Set(currentSales.map(s => s.customerId).filter(Boolean)).size;
  const previousCustomers = new Set(previousSales.map(s => s.customerId).filter(Boolean)).size;
  const customerGrowth = previousCustomers > 0 ? ((currentCustomers - previousCustomers) / previousCustomers) * 100 : 0;

  // Métriques opérationnelles
  const averageOrderValue = currentSales.length > 0 ? currentRevenue / currentSales.length : 0;
  const conversionRate = Math.min(95, Math.max(1, (currentSales.length / Math.max(currentSales.length * 10, 100)) * 100)); // Simulation
  
  // Rotation des stocks (simulation)
  const stockData = await prisma.stock.findMany({
    where: { organizationId },
    include: { product: { select: { unitPrice: true } } }
  });
  
  const totalStockValue = stockData.reduce((sum, stock) => 
    sum + (stock.quantity * Number(stock.product.unitPrice)), 0
  );
  const inventoryTurnover = totalStockValue > 0 ? currentRevenue / totalStockValue : 0;

  // KPIs détaillés
  const kpis = [
    {
      name: "Ventes Totales",
      value: currentSales.length,
      change: salesGrowth,
      trend: salesGrowth > 0 ? "up" as const : salesGrowth < 0 ? "down" as const : "stable" as const
    },
    {
      name: "Chiffre d'Affaires",
      value: currentRevenue,
      change: revenueGrowth,
      trend: revenueGrowth > 0 ? "up" as const : revenueGrowth < 0 ? "down" as const : "stable" as const
    },
    {
      name: "Clients Actifs",
      value: currentCustomers,
      change: customerGrowth,
      trend: customerGrowth > 0 ? "up" as const : customerGrowth < 0 ? "down" as const : "stable" as const
    },
    {
      name: "Panier Moyen",
      value: averageOrderValue,
      change: 0, // Simulation
      trend: "stable" as const
    }
  ];

  const report = {
    salesGrowth,
    revenueGrowth,
    customerGrowth,
    inventoryTurnover,
    averageOrderValue,
    conversionRate,
    kpis
  };

  return NextResponse.json(report);
}