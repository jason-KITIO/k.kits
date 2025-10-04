import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOptimizedQuery } from "./use-optimized-query";
import { invitationService } from "@/services/invitation-service";
import { toast } from "sonner";
import { CreateInvitationData, UpdateInvitationData } from "@/types/invitation";

export const useInvitations = (organizationId: string) => {
  return useOptimizedQuery({
    queryKey: ["invitations", organizationId],
    queryFn: async () => await invitationService.getInvitations(organizationId),
    enabled: !!organizationId,
  });
};

export const useInvitation = (organizationId: string, invitationId: string) => {
  return useOptimizedQuery({
    queryKey: ["invitation", organizationId, invitationId],
    queryFn: async () => await invitationService.getInvitation(organizationId, invitationId),
    enabled: !!organizationId && !!invitationId,
  });
};

export const useCreateInvitation = (organizationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateInvitationData) => 
      await invitationService.createInvitation(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations", organizationId] });
      toast.success("Succès", {
        description: "Invitation envoyée avec succès",
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

export const useUpdateInvitation = (organizationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ invitationId, data }: { invitationId: string; data: UpdateInvitationData }) =>
      await invitationService.updateInvitation(organizationId, invitationId, data),
    onSuccess: (_, { invitationId }) => {
      queryClient.invalidateQueries({ queryKey: ["invitations", organizationId] });
      queryClient.invalidateQueries({ queryKey: ["invitation", organizationId, invitationId] });
      toast.success("Succès", {
        description: "Invitation modifiée avec succès",
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

export const useCancelInvitation = (organizationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (invitationId: string) =>
      await invitationService.cancelInvitation(organizationId, invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations", organizationId] });
      toast.success("Succès", {
        description: "Invitation annulée avec succès",
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

export const useValidateInvitation = (token: string) => {
  return useOptimizedQuery({
    queryKey: ["validate-invitation", token],
    queryFn: async () => await invitationService.validateInvitation(token),
    enabled: !!token,
  });
};