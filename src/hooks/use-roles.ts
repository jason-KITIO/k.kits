import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roleService } from "@/services/role-service";
import { CreateRoleData, UpdateRoleData } from "@/types/role";

export const useRoles = (organizationId: string) => {
  return useQuery({
    queryKey: ["roles", organizationId],
    queryFn: async () => await roleService.getRoles(organizationId),
    enabled: !!organizationId,
    staleTime: 15 * 60 * 1000,
  });
};

export const useRole = (organizationId: string, roleId: string) => {
  return useQuery({
    queryKey: ["role", organizationId, roleId],
    queryFn: async () => await roleService.getRole(organizationId, roleId),
    enabled: !!organizationId && !!roleId,
    staleTime: 15 * 60 * 1000,
  });
};

export const useCreateRole = (organizationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateRoleData) => 
      await roleService.createRole(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles", organizationId] });
    },
  });
};

export const useUpdateRole = (organizationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ roleId, data }: { roleId: string; data: UpdateRoleData }) =>
      await roleService.updateRole(organizationId, roleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles", organizationId] });
    },
  });
};

export const useDeleteRole = (organizationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (roleId: string) =>
      await roleService.deleteRole(organizationId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles", organizationId] });
    },
  });
};