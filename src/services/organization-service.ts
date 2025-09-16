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
