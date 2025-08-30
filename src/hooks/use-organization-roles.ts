import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchOrganizationRoles,
  createOrganizationRole,
} from "@/services/organization-role-service";
import type { RoleCreatePayload } from "@/types/organization-role";

export function useOrganizationRoles(organizationId: string) {
  return useQuery({
    queryKey: ["organizationRoles", organizationId],
    queryFn: () => fetchOrganizationRoles(organizationId),
    enabled: Boolean(organizationId),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useCreateOrganizationRole(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RoleCreatePayload) =>
      createOrganizationRole(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizationRoles", organizationId],
      });
    },
    retry: false,
  });
}
