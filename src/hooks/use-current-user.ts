import { useAuth } from "@/providers/auth-provider";

// Hook dépréciéé - utilise maintenant AuthProvider pour éviter les appels API multiples
export const useCurrentUser = () => {
  const { user, isLoading, refetch } = useAuth();
  
  return {
    data: user ? { user } : null,
    error: null,
    isLoading,
    isError: false,
    refetch
  };
};

// Hook recommandé pour les nouveaux composants
export const useUser = () => {
  if (process.env.NODE_ENV === 'development') {
    console.warn("useCurrentUser is deprecated. Use useAuth from @/providers/auth-provider instead.");
  }
  return useAuth();
};
