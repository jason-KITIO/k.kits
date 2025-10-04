"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = 'selected-org-id';

function loadOrganizationId(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cookies = document.cookie.split(";");
    const orgCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("selected-org-id=")
    );

    if (orgCookie) {
      return orgCookie.split("=")[1];
    }
    
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveOrganizationId(orgId: string) {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(STORAGE_KEY, orgId);
  document.cookie = `selected-org-id=${orgId}; path=/; max-age=${60 * 60 * 24 * 30}`;
}

export function useOrganization() {
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const orgId = loadOrganizationId();
    setOrganizationId(orgId);
    setIsLoading(false);
  }, []);

  const setCurrentOrganization = (orgId: string) => {
    saveOrganizationId(orgId);
    setOrganizationId(orgId);
  };

  return {
    organizationId,
    isLoading,
    setCurrentOrganization,
  };
}
