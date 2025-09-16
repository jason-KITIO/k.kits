"use client";

import { usePermissions } from "@/hooks/use-permissions";
import { useAuth } from "@/providers/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Shield, ArrowLeft, Loader2, Store } from "lucide-react";
import Link from "next/link";

interface StorePageProtectionProps {
  children: React.ReactNode;
  requiredPermission: string;
  organizationId: string;
  storeId: string;
  fallback?: React.ReactNode;
}

export function StorePageProtection({
  children,
  requiredPermission,
  organizationId,
  storeId,
  fallback,
}: StorePageProtectionProps) {
  const { isLoading } = useAuth();
  const error = null; // Géré par le provider
  const { hasPermission, is } = usePermissions(organizationId);

  // État de chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Vérification des permissions...</span>
        </div>
      </div>
    );
  }

  // Erreur d'authentification
  if (error) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Shield className="h-5 w-5" />
            Erreur d'authentification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Une erreur s'est produite lors de la vérification de vos permissions.
          </p>
          <Button asChild>
            <Link href="/login">Se reconnecter</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Vérification des permissions
  const hasAccess = hasPermission(requiredPermission) || is.owner;

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <Store className="h-5 w-5" />
            Accès restreint à cette boutique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Vous n'avez pas les permissions nécessaires pour accéder à cette section de la boutique.
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Permission requise: <code className="bg-muted px-1 py-0.5 rounded text-xs">{requiredPermission}</code>
          </p>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/preferences/organizations/${organizationId}/stores/${storeId}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au dashboard
              </Link>
            </Button>
            <Button asChild>
              <Link href="/support">Contacter le support</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}