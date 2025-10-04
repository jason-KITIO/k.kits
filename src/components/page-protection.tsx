"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserPermissions } from "@/hooks/use-auth-with-roles";
import { useAuth } from "@/providers/auth-provider";
import { PERMISSIONS } from "@/lib/permissions";

interface PageProtectionProps {
  children: React.ReactNode;
  requiredPermission: string;
  organizationId?: string;
  fallbackUrl?: string;
}

export function PageProtection({
  children,
  requiredPermission,
  organizationId,
  fallbackUrl = "/preferences"
}: PageProtectionProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const userPermissions = useUserPermissions(organizationId);

  useEffect(() => {
    if (isLoading) return;

    // Si pas d'utilisateur connecté, rediriger vers login
    if (!user) {
      router.push("/login");
      return;
    }

    // Si pas d'organisation spécifiée mais requise
    if (!organizationId && requiredPermission !== PERMISSIONS.DASHBOARD_READ) {
      router.push("/preferences");
      return;
    }

    // Vérifier les permissions
    const hasPermission = userPermissions.includes(requiredPermission) || 
                         userPermissions.includes("*");

    if (!hasPermission) {
      // Rediriger vers une page autorisée selon le rôle
      const redirectUrl = getAuthorizedRedirect(userPermissions, organizationId);
      router.push(redirectUrl || fallbackUrl);
    }
  }, [user, userPermissions, requiredPermission, organizationId, router, isLoading, fallbackUrl]);

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si pas d'utilisateur, ne rien afficher (redirection en cours)
  if (!user) {
    return null;
  }

  // Vérifier les permissions
  const hasPermission = userPermissions.includes(requiredPermission) || 
                       userPermissions.includes("*");

  // Si pas de permission, ne rien afficher (redirection en cours)
  if (!hasPermission) {
    return null;
  }

  // Afficher le contenu si tout est OK
  return <>{children}</>;
}

// Fonction pour déterminer la page de redirection selon les permissions
function getAuthorizedRedirect(permissions: string[], organizationId?: string): string | null {
  const baseUrl = organizationId ? `/preferences/organizations/${organizationId}` : "";

  // Priorité des redirections selon les permissions disponibles
  if (permissions.includes(PERMISSIONS.DASHBOARD_READ)) {
    return `${baseUrl}/dashboard`;
  }
  
  if (permissions.includes(PERMISSIONS.SALE_READ)) {
    return `${baseUrl}/sales`;
  }
  
  if (permissions.includes(PERMISSIONS.STOCK_READ)) {
    return `${baseUrl}/stock-alerts`;
  }
  
  if (permissions.includes(PERMISSIONS.PRODUCT_READ)) {
    return `${baseUrl}/products`;
  }

  // Si aucune permission spécifique, rediriger vers les préférences
  return "/preferences";
}

// Hook pour vérifier rapidement une permission
export function usePagePermission(requiredPermission: string, organizationId?: string) {
  const userPermissions = useUserPermissions(organizationId);
  
  return {
    hasPermission: userPermissions.includes(requiredPermission) || userPermissions.includes("*"),
    permissions: userPermissions
  };
}