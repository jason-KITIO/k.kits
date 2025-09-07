import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invitationService } from "@/services/invitation-service";
import { CreateInvitationData, UpdateInvitationData } from "@/types/invitation";

export const useInvitations = (organizationId: string) => {
  return useQuery({
    queryKey: ["invitations", organizationId],
    queryFn: async () => await invitationService.getInvitations(organizationId),
    enabled: !!organizationId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useInvitation = (organizationId: string, invitationId: string) => {
  return useQuery({
    queryKey: ["invitation", organizationId, invitationId],
    queryFn: async () => await invitationService.getInvitation(organizationId, invitationId),
    enabled: !!organizationId && !!invitationId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateInvitation = (organizationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateInvitationData) => 
      await invitationService.createInvitation(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations", organizationId] });
    },
  });
};

export const useUpdateInvitation = (organizationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ invitationId, data }: { invitationId: string; data: UpdateInvitationData }) =>
      await invitationService.updateInvitation(organizationId, invitationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations", organizationId] });
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
    },
  });
};

export const useValidateInvitation = (token: string) => {
  return useQuery({
    queryKey: ["validate-invitation", token],
    queryFn: async () => await invitationService.validateInvitation(token),
    enabled: !!token,
    staleTime: 0,
  });
};