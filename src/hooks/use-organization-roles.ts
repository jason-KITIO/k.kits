import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchOrganizationRoles,
  createOrganizationRole,
} from "@/services/organization-role-service";
import type { RoleCreatePayload } from "@/types/organization-role";

export const useOrganizationRoles = (organizationId: string) => {
  return useQuery({
    queryKey: ["organizationRoles", organizationId],
    queryFn: async () => await fetchOrganizationRoles(organizationId),
    enabled: Boolean(organizationId),
    staleTime: 15 * 60 * 1000,
  });
};

export const useCreateOrganizationRole = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RoleCreatePayload) =>
      await createOrganizationRole(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizationRoles", organizationId] });
    },
  });
};
