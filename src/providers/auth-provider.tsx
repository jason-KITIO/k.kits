"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cache global singleton avec gestion d'état améliorée
class AuthCache {
  private user: UserWithRoles | null = null;
  private timestamp = 0;
  private promise: Promise<UserWithRoles | null> | null = null;
  private isInitialized = false;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly STORAGE_KEY = 'k-kits-auth-cache';
  
  load() {
    if (typeof window === 'undefined' || this.isInitialized) return;
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const { user, timestamp } = JSON.parse(stored);
        if (Date.now() - timestamp < this.CACHE_DURATION) {
          this.user = user;
          this.timestamp = timestamp;
        } else {
          // Cache expiré, nettoyer
          localStorage.removeItem(this.STORAGE_KEY);
        }
      }
    } catch {
      localStorage.removeItem(this.STORAGE_KEY);
    }
    this.isInitialized = true;
  }
  
  save() {
    if (typeof window === 'undefined') return;
    try {
      if (this.user) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
          user: this.user,
          timestamp: this.timestamp
        }));
      } else {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    } catch {}
  }
  
  isValid() {
    return this.user && (Date.now() - this.timestamp) < this.CACHE_DURATION;
  }
  
  getUser() { return this.user; }
  setUser(user: UserWithRoles | null) { 
    this.user = user;
    this.timestamp = Date.now();
    this.save();
  }
  
  getPromise() { return this.promise; }
  setPromise(promise: Promise<UserWithRoles | null> | null) { this.promise = promise; }
  
  clear() {
    this.user = null;
    this.timestamp = 0;
    this.promise = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}

const authCache = new AuthCache();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserWithRoles | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    // Charger le cache au premier appel
    authCache.load();
    
    // Utiliser le cache si valide
    if (authCache.isValid()) {
      const cachedUser = authCache.getUser();
      setUser(cachedUser);
      setIsLoading(false);
      return cachedUser;
    }
    
    // Éviter les appels multiples - attendre la promesse existante
    const existingPromise = authCache.getPromise();
    if (existingPromise) {
      const user = await existingPromise;
      setUser(user);
      setIsLoading(false);
      return user;
    }
    
    // Créer une nouvelle promesse pour l'appel API
    const promise = (async () => {
      try {
        console.log('🔄 AuthProvider: Fetching user from API');
        const response = await fetch("/api/auth/me", {
          credentials: 'include',
          cache: 'no-store'
        });
        
        let userData: UserWithRoles | null = null;
        if (response.ok) {
          const data = await response.json();
          userData = data.user || data;
        }
        
        authCache.setUser(userData);
        return userData;
      } catch (error) {
        console.error("Auth error:", error);
        authCache.setUser(null);
        return null;
      } finally {
        authCache.setPromise(null);
      }
    })();
    
    authCache.setPromise(promise);
    const user = await promise;
    setUser(user);
    setIsLoading(false);
    return user;
  };

  const refetch = async () => {
    setIsLoading(true);
    authCache.clear();
    await fetchUser();
  };

  useEffect(() => {
    // Initialiser avec le cache si disponible
    authCache.load();
    if (authCache.isValid()) {
      setUser(authCache.getUser());
      setIsLoading(false);
    } else {
      fetchUser();
    }
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