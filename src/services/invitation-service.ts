import type {
  InvitationWithRelations,
  SendInvitationPayload,
  AcceptInvitationPayload,
} from "@/types/invitation";

export async function sendInvitation(
  payload: SendInvitationPayload
): Promise<{ message: string; invitation: InvitationWithRelations }> {
  const res = await fetch(
    `/api/organization/${payload.organizationId}/invitations/send`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: payload.email, role: payload.roleId }),
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.message || "Erreur lors de l'envoi de l'invitation"
    );
  }

  return res.json();
}

export async function acceptInvitation(
  payload: AcceptInvitationPayload
): Promise<{ message: string }> {
  const res = await fetch(
    `/api/organization/${payload.organizationId}/invitations/accept?token=${payload.token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: payload.username,
        password: payload.password,
      }),
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.message || "Erreur lors de l'acceptation de l'invitation"
    );
  }

  return res.json();
}

export async function fetchInvitationByToken(
  token: string,
  organizationId: string
): Promise<{ email: string }> {
  const res = await fetch(
    `/api/organization/${organizationId}/invitations/accept/details?token=${token}`,
    {
      method: "GET",
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(
      error.message || "Erreur lors de la récupération de l'invitation"
    );
  }

  const data = await res.json();
  console.log(data);
  return data;
}
