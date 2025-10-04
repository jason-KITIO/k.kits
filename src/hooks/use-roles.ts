import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOptimizedQuery } from "./use-optimized-query";
import { roleService } from "@/services/role-service";
import { toast } from "sonner";
import { CreateRoleData, UpdateRoleData } from "@/types/role";

export const useRoles = (organizationId: string) => {
  return useOptimizedQuery({
    queryKey: ["roles", organizationId],
    queryFn: async () => await roleService.getRoles(organizationId),
    enabled: !!organizationId,
  });
};

export const useRole = (organizationId: string, roleId: string) => {
  return useOptimizedQuery({
    queryKey: ["role", organizationId, roleId],
    queryFn: async () => await roleService.getRole(organizationId, roleId),
    enabled: !!organizationId && !!roleId,
  });
};

export const useCreateRole = (organizationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateRoleData) => 
      await roleService.createRole(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles", organizationId] });
      toast.success("Succès", {
        description: "Rôle créé avec succès",
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      toast.error("Erreur", {
        description: error.message,
        duration: 5000,
      });
    },
  });
};

export const useUpdateRole = (organizationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ roleId, data }: { roleId: string; data: UpdateRoleData }) =>
      await roleService.updateRole(organizationId, roleId, data),
    onSuccess: (_, { roleId }) => {
      queryClient.invalidateQueries({ queryKey: ["roles", organizationId] });
      queryClient.invalidateQueries({ queryKey: ["role", organizationId, roleId] });
      toast.success("Succès", {
        description: "Rôle modifié avec succès",
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      toast.error("Erreur", {
        description: error.message,
        duration: 5000,
      });
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
      toast.success("Succès", {
        description: "Rôle supprimé avec succès",
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      toast.error("Erreur", {
        description: error.message,
        duration: 5000,
      });
    },
  });
};