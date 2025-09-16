import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { refetch } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de la déconnexion");
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Nettoyer le cache React Query
      queryClient.clear();
      
      // Nettoyer le cache AuthProvider
      if (typeof window !== 'undefined') {
        localStorage.removeItem('k-kits-auth-cache');
        document.cookie = 'session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'selected-org-id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
      
      // Forcer la mise à jour du contexte auth
      refetch();
      
      // Rediriger vers la page d'accueil
      router.push("/");
      router.refresh();
    },
    onError: (error) => {
      console.error("Erreur logout:", error);
    },
  });
}