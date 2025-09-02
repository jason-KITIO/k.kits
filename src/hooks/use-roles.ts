import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roleService } from "@/services/role-service";
import { CreateRoleData, UpdateRoleData } from "@/types/role";

export function useRoles(organizationId: string) {
  return useQuery({
    queryKey: ["roles", organizationId],
    queryFn: () => roleService.getRoles(organizationId),
    enabled: !!organizationId,
  });
}

export function useRole(organizationId: string, roleId: string) {
  return useQuery({
    queryKey: ["role", organizationId, roleId],
    queryFn: () => roleService.getRole(organizationId, roleId),
    enabled: !!organizationId && !!roleId,
  });
}

export function useCreateRole(organizationId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateRoleData) => 
      roleService.createRole(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles", organizationId] });
    },
  });
}

export function useUpdateRole(organizationId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: string; data: UpdateRoleData }) =>
      roleService.updateRole(organizationId, roleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles", organizationId] });
    },
  });
}

export function useDeleteRole(organizationId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (roleId: string) =>
      roleService.deleteRole(organizationId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles", organizationId] });
    },
  });
}