import { organizationCreateSchema } from "@/schema";
import { Organization } from "@prisma/client";
import z from "zod";

const API_BASE = "/api/organization";

export async function fetchUserOrganizations(): Promise<Organization[]> {
  const res = await fetch(`${API_BASE}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Erreur lors de la récupération des organisations");
  }
  const data = await res.json();
  return data || [];
}

// Récupérer une organisation spécifique par ID
export async function getOrganizationById(id: string): Promise<Organization> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(
      error.error || "Erreur lors de la récupération de l'organisation"
    );
  }
  return res.json();
}
export async function createOrganization(
  data: z.infer<typeof organizationCreateSchema>
): Promise<Organization> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(
      error.error || "Erreur lors de la création de l'organisation"
    );
  }

  return res.json();
}

// Mettre à jour une organisation par ID
export async function updateOrganization(
  id: string,
  data: Partial<Organization>
): Promise<Organization> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(
      error.error || "Erreur lors de la mise à jour de l'organisation"
    );
  }
  return res.json();
}

// Supprimer une organisation par ID
export async function deleteOrganization(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(
      error.error || "Erreur lors de la suppression de l'organisation"
    );
  }
}

// Service object pour compatibilité avec useOrganization.ts
export const organizationService = {
  getDashboard: async (organizationId: string) => {
    const res = await fetch(`${API_BASE}/${organizationId}/dashboard`);
    if (!res.ok) throw new Error('Erreur dashboard');
    return res.json();
  },
  getSales: async (organizationId: string, params?: Record<string, unknown>) => {
    const query = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    const res = await fetch(`${API_BASE}/${organizationId}/sales${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Erreur sales');
    return res.json();
  },
  getNotifications: async (organizationId: string) => {
    const res = await fetch(`${API_BASE}/${organizationId}/notifications`);
    if (!res.ok) throw new Error('Erreur notifications');
    return res.json();
  },
  getStockAlerts: async (organizationId: string) => {
    const res = await fetch(`${API_BASE}/${organizationId}/stock-alerts`);
    if (!res.ok) throw new Error('Erreur stock alerts');
    return res.json();
  },
  getStockTransfers: async (organizationId: string) => {
    const res = await fetch(`${API_BASE}/${organizationId}/stock-transfers`);
    if (!res.ok) throw new Error('Erreur stock transfers');
    return res.json();
  },
  getUsers: async (organizationId: string) => {
    const res = await fetch(`${API_BASE}/${organizationId}/users`);
    if (!res.ok) throw new Error('Erreur users');
    return res.json();
  },
  search: async (organizationId: string, query: string, type: string) => {
    const res = await fetch(`${API_BASE}/${organizationId}/search?q=${query}&type=${type}`);
    if (!res.ok) throw new Error('Erreur search');
    return res.json();
  },
  getReports: async (organizationId: string, type: string, params?: Record<string, unknown>) => {
    const query = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    const res = await fetch(`${API_BASE}/${organizationId}/reports?type=${type}${query ? `&${query}` : ''}`);
    if (!res.ok) throw new Error('Erreur reports');
    return res.json();
  },
  getSettings: async (organizationId: string) => {
    const res = await fetch(`${API_BASE}/${organizationId}/settings`);
    if (!res.ok) throw new Error('Erreur settings');
    return res.json();
  },
  createNotification: async (organizationId: string, data: unknown) => {
    const res = await fetch(`${API_BASE}/${organizationId}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erreur create notification');
    return res.json();
  },
  markNotificationsRead: async (organizationId: string, data: unknown) => {
    const res = await fetch(`${API_BASE}/${organizationId}/notifications/mark-read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erreur mark notifications');
    return res.json();
  },
  createStockTransfer: async (organizationId: string, data: unknown) => {
    const res = await fetch(`${API_BASE}/${organizationId}/stock-transfers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erreur create stock transfer');
    return res.json();
  },
  updateSettings: async (organizationId: string, data: unknown) => {
    const res = await fetch(`${API_BASE}/${organizationId}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erreur update settings');
    return res.json();
  }
};
