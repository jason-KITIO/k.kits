import { Organization } from "@prisma/client";

export async function fetchUserOrganizations(): Promise<Organization[]> {
  const res = await fetch("/api/organization", { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Erreur lors de la récupération des organisations");
  }

  const data = await res.json();
  return data.organizations;
}

export async function getOrganizationById(id: string): Promise<Organization> {
  const res = await fetch(`/api/organization/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(
      error.message || "Erreur lors de la récupération de l'organisation"
    );
  }

  return res.json();
}
