import { useQuery } from "@tanstack/react-query";

interface Category {
  id: string;
  name: string;
  description?: string;
  active: boolean;
}

export function useCategories(organizationId: string) {
  return useQuery({
    queryKey: ["categories", organizationId],
    queryFn: async (): Promise<Category[]> => {
      console.log('Fetching categories for org:', organizationId);
      const response = await fetch(`/api/organization/${organizationId}/categories`, {
        credentials: 'include',
      });
      console.log('Categories response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Categories error:', errorText);
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      console.log('Categories data:', data);
      return data;
    },
    enabled: !!organizationId,
    retry: 1,
  });
}