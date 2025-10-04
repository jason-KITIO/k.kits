import { z } from "zod";

export const reportTypeSchema = z.enum([
  "sales",
  "stock",
  "movements", 
  "profit",
  "customers",
  "products",
  "financial",
  "performance"
]);

export const reportPeriodSchema = z.enum([
  "today",
  "yesterday", 
  "this_week",
  "last_week",
  "this_month",
  "last_month",
  "this_quarter",
  "last_quarter",
  "this_year",
  "last_year",
  "custom"
]);

export const reportFormatSchema = z.enum([
  "json",
  "csv", 
  "excel",
  "pdf"
]);

export const reportRequestSchema = z.object({
  type: reportTypeSchema,
  period: reportPeriodSchema.optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  storeId: z.string().optional(),
  warehouseId: z.string().optional(),
  categoryId: z.string().optional(),
  productId: z.string().optional(),
  customerId: z.string().optional(),
  format: reportFormatSchema.default("json"),
  includeDetails: z.boolean().default(true),
  groupBy: z.enum(["day", "week", "month", "quarter", "year", "product", "category", "store", "customer"]).optional()
});

export const salesReportSchema = z.object({
  totalSales: z.number(),
  totalRevenue: z.number(),
  averageOrderValue: z.number(),
  salesCount: z.number(),
  topProducts: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    quantity: z.number(),
    revenue: z.number()
  })),
  salesByPeriod: z.array(z.object({
    period: z.string(),
    sales: z.number(),
    revenue: z.number()
  })),
  salesByStore: z.array(z.object({
    storeId: z.string(),
    storeName: z.string(),
    sales: z.number(),
    revenue: z.number()
  }))
});

export const stockReportSchema = z.object({
  totalProducts: z.number(),
  totalStockValue: z.number(),
  lowStockItems: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    currentStock: z.number(),
    minStock: z.number(),
    location: z.string()
  })),
  stockByCategory: z.array(z.object({
    categoryId: z.string(),
    categoryName: z.string(),
    totalQuantity: z.number(),
    totalValue: z.number()
  })),
  stockByLocation: z.array(z.object({
    locationId: z.string(),
    locationName: z.string(),
    locationType: z.enum(["store", "warehouse"]),
    totalQuantity: z.number(),
    totalValue: z.number()
  }))
});

export const movementReportSchema = z.object({
  totalMovements: z.number(),
  movementsByType: z.array(z.object({
    type: z.string(),
    count: z.number(),
    quantity: z.number()
  })),
  movementsByPeriod: z.array(z.object({
    period: z.string(),
    movements: z.number(),
    quantity: z.number()
  })),
  topMovedProducts: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    totalQuantity: z.number(),
    movementCount: z.number()
  }))
});

export const profitReportSchema = z.object({
  totalRevenue: z.number(),
  totalCost: z.number(),
  grossProfit: z.number(),
  profitMargin: z.number(),
  profitByProduct: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    revenue: z.number(),
    cost: z.number(),
    profit: z.number(),
    margin: z.number()
  })),
  profitByPeriod: z.array(z.object({
    period: z.string(),
    revenue: z.number(),
    cost: z.number(),
    profit: z.number()
  }))
});

export const customerReportSchema = z.object({
  totalCustomers: z.number(),
  newCustomers: z.number(),
  returningCustomers: z.number(),
  topCustomers: z.array(z.object({
    customerId: z.string(),
    customerName: z.string(),
    totalSpent: z.number(),
    orderCount: z.number(),
    lastOrderDate: z.string()
  })),
  customersByPeriod: z.array(z.object({
    period: z.string(),
    newCustomers: z.number(),
    totalCustomers: z.number()
  }))
});

export const productReportSchema = z.object({
  totalProducts: z.number(),
  activeProducts: z.number(),
  lowStockProducts: z.number(),
  outOfStockProducts: z.number(),
  topSellingProducts: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    sku: z.string(),
    quantitySold: z.number(),
    revenue: z.number(),
    category: z.string().optional()
  })),
  lowPerformingProducts: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    sku: z.string(),
    quantitySold: z.number(),
    stockLevel: z.number(),
    daysSinceLastSale: z.number()
  })),
  productsByCategory: z.array(z.object({
    categoryId: z.string(),
    categoryName: z.string(),
    productCount: z.number(),
    totalRevenue: z.number(),
    averagePrice: z.number()
  })),
  stockAnalysis: z.object({
    totalStockValue: z.number(),
    averageStockLevel: z.number(),
    stockTurnoverRate: z.number()
  })
});

export const financialReportSchema = z.object({
  totalRevenue: z.number(),
  totalExpenses: z.number(),
  netIncome: z.number(),
  grossMargin: z.number(),
  operatingMargin: z.number(),
  cashFlow: z.object({
    operating: z.number(),
    investing: z.number(),
    financing: z.number(),
    net: z.number()
  }),
  revenueByPeriod: z.array(z.object({
    period: z.string(),
    revenue: z.number(),
    expenses: z.number(),
    profit: z.number()
  })),
  expensesByCategory: z.array(z.object({
    category: z.string(),
    amount: z.number(),
    percentage: z.number()
  })),
  profitabilityMetrics: z.object({
    roi: z.number(),
    roa: z.number(),
    grossProfitMargin: z.number(),
    netProfitMargin: z.number()
  }),
  financialRatios: z.object({
    currentRatio: z.number(),
    quickRatio: z.number(),
    debtToEquity: z.number(),
    inventoryTurnover: z.number()
  })
});

export const performanceReportSchema = z.object({
  salesGrowth: z.number(),
  revenueGrowth: z.number(),
  customerGrowth: z.number(),
  inventoryTurnover: z.number(),
  averageOrderValue: z.number(),
  conversionRate: z.number(),
  kpis: z.array(z.object({
    name: z.string(),
    value: z.number(),
    change: z.number(),
    trend: z.enum(["up", "down", "stable"])
  }))
});

export type ReportType = z.infer<typeof reportTypeSchema>;
export type ReportPeriod = z.infer<typeof reportPeriodSchema>;
export type ReportFormat = z.infer<typeof reportFormatSchema>;
export type ReportRequest = z.infer<typeof reportRequestSchema>;
export type SalesReport = z.infer<typeof salesReportSchema>;
export type StockReport = z.infer<typeof stockReportSchema>;
export type MovementReport = z.infer<typeof movementReportSchema>;
export type ProfitReport = z.infer<typeof profitReportSchema>;
export type CustomerReport = z.infer<typeof customerReportSchema>;
export type ProductReport = z.infer<typeof productReportSchema>;
export type FinancialReport = z.infer<typeof financialReportSchema>;
export type PerformanceReport = z.infer<typeof performanceReportSchema>;