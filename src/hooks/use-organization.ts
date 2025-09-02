"use client";

import { useState, useEffect } from "react";

export function useOrganization() {
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Récupérer l'organizationId depuis le cookie ou localStorage
    const getOrganizationId = () => {
      // Méthode 1: Depuis les cookies (côté client)
      const cookies = document.cookie.split(";");
      const orgCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("selected-org-id=")
      );

      if (orgCookie) {
        const orgId = orgCookie.split("=")[1];
        return orgId;
      }

      // Méthode 2: Depuis localStorage en fallback
      const storedOrgId = localStorage.getItem("selected-org-id");
      return storedOrgId;
    };

    const orgId = getOrganizationId();
    setOrganizationId(orgId);
    setIsLoading(false);
  }, []);

  const setCurrentOrganization = (orgId: string) => {
    setOrganizationId(orgId);
    localStorage.setItem("selected-org-id", orgId);
    // Optionnel: Mettre à jour le cookie côté client
    document.cookie = `selected-org-id=${orgId}; path=/; max-age=${
      60 * 60 * 24 * 30
    }`;
  };

  return {
    organizationId,
    isLoading,
    setCurrentOrganization,
  };
}
