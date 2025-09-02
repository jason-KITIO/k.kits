import { useMutation } from "@tanstack/react-query";


export function useSendInvitation() {
  return useMutation({
    // mutationFn: (payload: SendInvitationPayload) => sendInvitation(payload),
    retry: false,
  });
}

export function useAcceptInvitation() {
  return useMutation({
    // mutationFn: (payload: AcceptInvitationPayload) => acceptInvitation(payload),
    retry: false,
  });
}
export function useInvitationEmail(token: string, organizationId: string) {
  return useMutation({
    // mutationFn: () => fetchInvitationByToken(token, organizationId),
  });
}
