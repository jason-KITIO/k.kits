import { useQuery } from "@tanstack/react-query";

interface Warehouse {
  id: string;
  name: string;
  address?: string;
  type: string;
  active: boolean;
}

export function useWarehouses(organizationId: string) {
  return useQuery({
    queryKey: ["warehouses", organizationId],
    queryFn: async (): Promise<Warehouse[]> => {
      console.log("Fetching warehouses for org:", organizationId);
      const response = await fetch(
        `/api/organization/${organizationId}/warehouses`,
        {
          credentials: "include",
        }
      );
      console.log("Warehouses response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Warehouses error:", errorText);
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      console.log("Warehouses data:", data);
      return data;
    },
    enabled: !!organizationId,
    retry: 1,
  });
}
