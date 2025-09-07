// Configuration centralisée du cache pour éviter les requêtes redondantes
export const CACHE_CONFIG = {
  // Données critiques (stock, ventes)
  CRITICAL: {
    staleTime: 30 * 1000, // 30 secondes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  },
  
  // Données transactionnelles (ventes, mouvements)
  TRANSACTIONAL: {
    staleTime: 1 * 60 * 1000, // 1 minute
    cacheTime: 10 * 60 * 1000, // 10 minutes
  },
  
  // Données fréquentes (dashboard, produits)
  FREQUENT: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  },
  
  // Données normales (utilisateurs, organisations)
  NORMAL: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 20 * 60 * 1000, // 20 minutes
  },
  
  // Données stables (rôles, catégories, fournisseurs)
  STABLE: {
    staleTime: 15 * 60 * 1000, // 15 minutes
    cacheTime: 60 * 60 * 1000, // 1 heure
  },
  
  // Données statiques (paramètres, configurations)
  STATIC: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 2 * 60 * 60 * 1000, // 2 heures
  },
  
  // Données temps réel (notifications)
  REALTIME: {
    staleTime: 10 * 1000, // 10 secondes
    cacheTime: 2 * 60 * 1000, // 2 minutes
  },
  
  // Données de validation (invitations, tokens)
  VALIDATION: {
    staleTime: 0, // Toujours frais
    cacheTime: 5 * 60 * 1000, // 5 minutes
  },
} as const;

// Options communes pour tous les hooks
export const COMMON_OPTIONS = {
  refetchOnWindowFocus: false,
  retry: false,
} as const;

// Options spéciales pour certains types de données
export const SPECIAL_OPTIONS = {
  notifications: {
    refetchOnWindowFocus: true, // Refetch pour notifications
  },
  search: {
    enabled: (query: string) => !!query && query.length > 2,
  },
} as const;