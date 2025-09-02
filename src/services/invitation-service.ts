import { Invitation, CreateInvitationData, UpdateInvitationData, InvitationValidation } from "@/types/invitation";

const API_BASE = "/api";

export const invitationService = {
  // Lister les invitations d'une organisation
  async getInvitations(organizationId: string): Promise<Invitation[]> {
    const response = await fetch(`${API_BASE}/organization/${organizationId}/invitations`);
    if (!response.ok) throw new Error("Erreur lors du chargement des invitations");
    return response.json();
  },

  // Créer une nouvelle invitation
  async createInvitation(organizationId: string, data: CreateInvitationData): Promise<Invitation> {
    const response = await fetch(`${API_BASE}/organization/${organizationId}/invitations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erreur lors de la création de l'invitation");
    return response.json();
  },

  // Récupérer une invitation spécifique
  async getInvitation(organizationId: string, invitationId: string): Promise<Invitation> {
    const response = await fetch(`${API_BASE}/organization/${organizationId}/invitations/${invitationId}`);
    if (!response.ok) throw new Error("Erreur lors du chargement de l'invitation");
    return response.json();
  },

  // Modifier une invitation
  async updateInvitation(organizationId: string, invitationId: string, data: UpdateInvitationData): Promise<Invitation> {
    const response = await fetch(`${API_BASE}/organization/${organizationId}/invitations/${invitationId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erreur lors de la modification de l'invitation");
    return response.json();
  },

  // Annuler une invitation
  async cancelInvitation(organizationId: string, invitationId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/organization/${organizationId}/invitations/${invitationId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erreur lors de l'annulation de l'invitation");
  },

  // Valider un token d'invitation (route publique)
  async validateInvitation(token: string): Promise<InvitationValidation> {
    const response = await fetch(`${API_BASE}/invitations/validate?token=${token}`);
    return response.json(); // Retourne toujours un objet avec valid: boolean
  },
};