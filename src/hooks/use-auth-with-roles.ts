"use client";

import { useAuth } from "@/providers/auth-provider";

/**
 * Hook pour récupérer les permissions de l'utilisateur pour une organisation
 */
export function useUserPermissions(organizationId?: string): string[] {
  const { user } = useAuth();

  if (!user || !organizationId) {
    return [];
  }

  // Récupérer les permissions de l'utilisateur pour cette organisation
  // TODO: Implémenter la logique réelle de récupération des permissions
  // Pour l'instant, retourner un tableau vide
  return [];
}
