"use client";

import React, { useContext, useEffect, useState } from "react";

interface UserWithRoles {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  organizationMembers: {
    id: string;
    organizationId: string;
    roleId: string;
    active: boolean;
    organization: {
      id: string;
      name: string;
    };
    role: {
      id: string;
      name: string;
      permissions: string[];
    };
  }[];
}

interface AuthContextType {
  user: UserWithRoles | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);



export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserWithRoles | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
      });

      let userData: UserWithRoles | null = null;
      if (response.ok) {
        const data = await response.json();
        userData = data.user || data;
      }

      setUser(userData);
      setIsLoading(false);
      return userData;
    } catch (error) {
      console.error("Auth error:", error);
      setUser(null);
      setIsLoading(false);
      return null;
    }
  };

  const refetch = async () => {
    setIsLoading(true);
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, refetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
