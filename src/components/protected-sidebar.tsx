"use client";

import { usePermissions } from "@/hooks/use-permissions";
import { useAuth } from "@/providers/auth-provider";
import { AppSidebar } from "./app-sidebar";
import { Sidebar, SidebarContent } from "./ui/sidebar";
import { SidebarSkeleton } from "./sidebar-skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface ProtectedSidebarProps {
  organizationId: string;
}

export function ProtectedSidebar({ organizationId }: ProtectedSidebarProps) {
  const { isLoading } = useAuth();
  const error = null; // Géré par le provider
  const { permissions, can } = usePermissions(organizationId);

  // État de chargement
  if (isLoading) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <SidebarSkeleton />
          </div>
        </TooltipTrigger>
      </Tooltip>
    );
  }

  // Erreur d'authentification
  if (error) {
    return (
      <Sidebar variant="inset">
        <SidebarContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <p className="text-sm text-destructive">Erreur de chargement</p>
              <p className="text-xs text-muted-foreground mt-1">
                Veuillez actualiser la page
              </p>
            </div>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  // Aucune permission
  if (permissions.length === 0) {
    return (
      <Sidebar variant="inset">
        <SidebarContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Accès limité</p>
              <p className="text-xs text-muted-foreground mt-1">
                Contactez votre administrateur
              </p>
            </div>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  // Sidebar normale avec permissions
  return <AppSidebar />;
}
