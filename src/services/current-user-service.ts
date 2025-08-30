import { meResponseSchema } from "@/schema/user-schema";

export async function fetchCurrentUser() {
  const res = await fetch("/api/auth/me");

  if (!res.ok) throw new Error("Erreur lors de la récupération du profil");

  const data = await res.json();
  return meResponseSchema.parse(data);
}
