"use client";

import { useAuth } from "@/providers/auth-provider";
import { useEffect, useState } from "react";

// Hook optimisé qui évite les re-renders inutiles
export function useAuthOptimized() {
  const { user, isLoading } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoading) {
      setIsAuthenticated(!!user);
    }
  }, [user, isLoading]);

  return {
    user,
    isLoading,
    isAuthenticated
  };
}