import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invitationService } from "@/services/invitation-service";
import { CreateInvitationData, UpdateInvitationData } from "@/types/invitation";

export function useInvitations(organizationId: string) {
  return useQuery({
    queryKey: ["invitations", organizationId],
    queryFn: () => invitationService.getInvitations(organizationId),
    enabled: !!organizationId,
  });
}

export function useInvitation(organizationId: string, invitationId: string) {
  return useQuery({
    queryKey: ["invitation", organizationId, invitationId],
    queryFn: () => invitationService.getInvitation(organizationId, invitationId),
    enabled: !!organizationId && !!invitationId,
  });
}

export function useCreateInvitation(organizationId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateInvitationData) => 
      invitationService.createInvitation(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations", organizationId] });
    },
  });
}

export function useUpdateInvitation(organizationId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ invitationId, data }: { invitationId: string; data: UpdateInvitationData }) =>
      invitationService.updateInvitation(organizationId, invitationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations", organizationId] });
    },
  });
}

export function useCancelInvitation(organizationId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (invitationId: string) =>
      invitationService.cancelInvitation(organizationId, invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations", organizationId] });
    },
  });
}

export function useValidateInvitation(token: string) {
  return useQuery({
    queryKey: ["validate-invitation", token],
    queryFn: () => invitationService.validateInvitation(token),
    enabled: !!token,
    retry: false,
  });
}