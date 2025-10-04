import { useOptimizedQuery } from "./use-optimized-query";
import { Currency, formatCurrency } from "@/lib/currency";

export const useOrganizationCurrency = (organizationId: string) => {
  return useOptimizedQuery({
    queryKey: ['organization-currency', organizationId],
    queryFn: async (): Promise<Currency> => {
      const response = await fetch(`/api/organization/${organizationId}/settings/currency`, {
        credentials: 'include',
      });
      if (!response.ok) {
        return 'XAF'; // Devise par défaut
      }
      const data = await response.json();
      return data.currency || 'XAF';
    },
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCurrencyFormatter = (organizationId: string) => {
  const { data: currency } = useOrganizationCurrency(organizationId);
  
  return (amount: number) => formatCurrency(amount, currency);
};