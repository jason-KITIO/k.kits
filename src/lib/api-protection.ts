import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "./auth-middleware";
import { PERMISSIONS } from "./permissions";

// Mapping des routes vers les permissions requises
const ROUTE_PERMISSIONS: Record<string, { permission: string; methods?: string[] }> = {
  // Dashboard
  "/api/organization/[organizationId]/dashboard": {
    permission: PERMISSIONS.DASHBOARD_READ,
    methods: ["GET"]
  },
  
  // Boutiques
  "/api/organization/[organizationId]/stores": {
    permission: PERMISSIONS.ORG_SETTINGS,
    methods: ["GET", "POST"]
  },
  
  // Ventes
  "/api/organization/[organizationId]/sales": {
    permission: PERMISSIONS.SALE_READ,
    methods: ["GET"]
  },
  "/api/organization/[organizationId]/sales/create": {
    permission: PERMISSIONS.SALE_CREATE,
    methods: ["POST"]
  },
  
  // Stock
  "/api/organization/[organizationId]/stock": {
    permission: PERMISSIONS.STOCK_READ,
    methods: ["GET"]
  },
  "/api/organization/[organizationId]/stock-transfers": {
    permission: PERMISSIONS.STOCK_TRANSFER,
    methods: ["GET", "POST"]
  },
  
  // Utilisateurs
  "/api/organization/[organizationId]/users": {
    permission: PERMISSIONS.USER_MANAGE,
    methods: ["GET", "POST", "PUT", "DELETE"]
  },
  
  // Invitations
  "/api/organization/[organizationId]/invitations": {
    permission: PERMISSIONS.USER_INVITE,
    methods: ["GET", "POST"]
  },
  
  // Rôles
  "/api/organization/[organizationId]/roles": {
    permission: PERMISSIONS.USER_ROLES,
    methods: ["GET", "POST", "PUT", "DELETE"]
  },
  
  // Rapports
  "/api/organization/[organizationId]/reports": {
    permission: PERMISSIONS.REPORT_READ,
    methods: ["GET"]
  },
  
  // Notifications
  "/api/organization/[organizationId]/notifications": {
    permission: PERMISSIONS.NOTIFICATION_READ,
    methods: ["GET"]
  }
};

// Wrapper pour protéger automatiquement les routes API
export function withApiProtection(handler: Function) {
  return async function (
    req: NextRequest,
    context: { params: Promise<{ organizationId: string; [key: string]: string }> }
  ) {
    try {
      const { organizationId } = await context.params;
      const { pathname } = req.nextUrl;
      const method = req.method;

      // Trouver la permission requise pour cette route
      const routeConfig = findRoutePermission(pathname, method);
      
      if (!routeConfig) {
        return NextResponse.json(
          { error: "Route non configurée" },
          { status: 500 }
        );
      }

      // Vérifier la permission
      const authResult = await checkPermission(req, organizationId, routeConfig.permission);
      
      if (!authResult.success) {
        return NextResponse.json(
          { 
            error: authResult.message,
            code: authResult.status === 401 ? "UNAUTHORIZED" : "FORBIDDEN"
          },
          { status: authResult.status }
        );
      }

      // Ajouter les infos utilisateur au contexte
      const enhancedContext = {
        ...context,
        user: authResult.user,
        permissions: authResult.permissions
      };

      // Exécuter le handler original
      return handler(req, enhancedContext);
      
    } catch (error) {
      console.error("Erreur protection API:", error);
      return NextResponse.json(
        { error: "Erreur serveur interne" },
        { status: 500 }
      );
    }
  };
}

// Fonction pour trouver la permission requise selon la route et méthode
function findRoutePermission(pathname: string, method: string): { permission: string } | null {
  // Normaliser le pathname pour matcher les patterns
  const normalizedPath = pathname.replace(/\/[^\/]+\/organization\/[^\/]+/, "/api/organization/[organizationId]");
  
  for (const [routePattern, config] of Object.entries(ROUTE_PERMISSIONS)) {
    if (normalizedPath.startsWith(routePattern)) {
      // Vérifier si la méthode est autorisée
      if (config.methods && !config.methods.includes(method)) {
        continue;
      }
      return { permission: config.permission };
    }
  }
  
  return null;
}

// Middleware spécialisé pour les différents types de permissions
export const requireDashboardAccess = withApiProtection;
export const requireStoreManagement = withApiProtection;
export const requireSalesAccess = withApiProtection;
export const requireUserManagement = withApiProtection;
export const requireStockAccess = withApiProtection;

// Helper pour vérifier les permissions dans les composants serveur
export async function checkUserPermission(
  organizationId: string,
  requiredPermission: string,
  req?: NextRequest
): Promise<{ hasPermission: boolean; user?: any; permissions?: string[] }> {
  
  if (!req) {
    // Si pas de request, on ne peut pas vérifier (côté serveur)
    return { hasPermission: false };
  }

  const result = await checkPermission(req, organizationId, requiredPermission);
  
  return {
    hasPermission: result.success,
    user: result.success ? result.user : undefined,
    permissions: result.success ? result.permissions : undefined
  };
}