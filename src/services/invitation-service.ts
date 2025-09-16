import { CreateInvitationData, UpdateInvitationData } from "@/types/invitation";

class InvitationService {
  async getInvitations(organizationId: string) {
    const response = await fetch(
      `/api/organization/${organizationId}/invitations`
    );
    if (!response.ok)
      throw new Error("Erreur lors du chargement des invitations");
    return response.json();
  }

  async getInvitation(organizationId: string, invitationId: string) {
    const response = await fetch(
      `/api/organization/${organizationId}/invitations/${invitationId}`
    );
    if (!response.ok)
      throw new Error("Erreur lors du chargement de l'invitation");
    return response.json();
  }

  async createInvitation(organizationId: string, data: CreateInvitationData) {
    const response = await fetch(
      `/api/organization/${organizationId}/invitations`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error || "Erreur lors de la création de l'invitation"
      );
    }
    return response.json();
  }

  async updateInvitation(
    organizationId: string,
    invitationId: string,
    data: UpdateInvitationData
  ) {
    const response = await fetch(
      `/api/organization/${organizationId}/invitations/${invitationId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok)
      throw new Error("Erreur lors de la mise à jour de l'invitation");
    return response.json();
  }

  async cancelInvitation(organizationId: string, invitationId: string) {
    const response = await fetch(
      `/api/organization/${organizationId}/invitations/${invitationId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok)
      throw new Error("Erreur lors de l'annulation de l'invitation");
    return response.json();
  }

  async validateInvitation(token: string) {
    const response = await fetch(`/api/invitations/accept?token=${token}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Invitation invalide");
    }
    return response.json();
  }

  async acceptInvitation(token: string, userId: string) {
    const response = await fetch("/api/invitations/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, userId }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erreur lors de l'acceptation");
    }
    return response.json();
  }
}

export const invitationService = new InvitationService();
