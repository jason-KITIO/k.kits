import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  OrganizationSettings,
  User,
  Role,
  Permission,
  UpdateOrganizationData,
  CreateUserData,
  CreateRoleData,
} from "@/types/settings";
import * as settingsService from "@/services/settings-service";

// Organization Settings
export function useOrganizationSettings(organizationId: string) {
  return useQuery<OrganizationSettings>({
    queryKey: ["organization-settings", organizationId],
    queryFn: () => settingsService.fetchOrganizationSettings(organizationId),
  });
}

export function useUpdateOrganizationSettings(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateOrganizationData) =>
      settingsService.updateOrganizationSettings(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization-settings", organizationId],
      });
    },
  });
}

// Users
export function useUsers(organizationId: string) {
  return useQuery<User[]>({
    queryKey: ["users", organizationId],
    queryFn: () => settingsService.fetchUsers(organizationId),
  });
}

export function useCreateUser(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserData) =>
      settingsService.createUser(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", organizationId] });
    },
  });
}

export function useUpdateUser(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateUserData> }) =>
      settingsService.updateUser(organizationId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", organizationId] });
    },
  });
}

export function useDeleteUser(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => settingsService.deleteUser(organizationId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", organizationId] });
    },
  });
}

// Roles
export function useRoles(organizationId: string) {
  return useQuery<Role[]>({
    queryKey: ["roles", organizationId],
    queryFn: () => settingsService.fetchRoles(organizationId),
  });
}

export function useCreateRole(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleData) =>
      settingsService.createRole(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles", organizationId] });
    },
  });
}

export function useUpdateRole(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateRoleData> }) =>
      settingsService.updateRole(organizationId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles", organizationId] });
    },
  });
}

export function useDeleteRole(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => settingsService.deleteRole(organizationId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles", organizationId] });
    },
  });
}

// Permissions
export function usePermissions() {
  return useQuery<Permission[]>({
    queryKey: ["permissions"],
    queryFn: () => settingsService.fetchPermissions(),
  });
}
