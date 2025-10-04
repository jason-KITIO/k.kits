import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} from "@/services/organization-service";
import { toast } from "sonner";
import type {
  CreateOrganizationData,
  UpdateOrganizationData,
} from "@/types/organization";

export const useOrganizations = () => {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: async () => await fetchUserOrganizations(),
  });
};

export const useOrganization = (id: string) => {
  return useQuery({
    queryKey: ["organization", id],
    queryFn: async () => await getOrganizationById(id),
    enabled: !!id,
  });
};

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOrganizationData) =>
      await createOrganization(data),
    onSuccess: (newOrg) => {
      queryClient.setQueryData(["organizations"], (old: unknown) => {
        const organizations = Array.isArray(old) ? old : [];
        return [...organizations, newOrg];
      });
      toast.success("Succès", {
        description: "Organisation créée avec succès",
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

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateOrganizationData;
    }) => await updateOrganization(id, data),
    onSuccess: (updatedOrg, { id }) => {
      queryClient.setQueryData(["organization", id], updatedOrg);
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Succès", {
        description: "Organisation modifiée avec succès",
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

export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => await deleteOrganization(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Succès", {
        description: "Organisation supprimée avec succès",
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
