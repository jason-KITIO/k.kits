import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OrganizationSettingsUpdate } from "@/schema/organization-settings.schema";

interface Organization {
  id: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  logo?: string;
  domain?: string;
  settings?: {
    notifications?: {
      email: boolean;
      stockAlerts: boolean;
      weeklyReports: boolean;
    };
  };
}

export function useOrganizationSettings(organizationId: string) {
  return useQuery({
    queryKey: ["organization-settings", organizationId],
    queryFn: async (): Promise<Organization> => {
      const response = await fetch(`/api/organization/${organizationId}/settings`);
      if (!response.ok) throw new Error("Failed to fetch organization settings");
      return response.json();
    },
  });
}

export function useUpdateOrganizationSettings(organizationId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: OrganizationSettingsUpdate) => {
      const response = await fetch(`/api/organization/${organizationId}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update organization settings");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-settings", organizationId] });
    },
  });
}