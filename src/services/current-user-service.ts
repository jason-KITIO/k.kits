import { meResponseSchema } from "@/schema/user-schema";

export async function fetchCurrentUser() {
  const res = await fetch("/api/auth/me");

  if (!res.ok) {
    if (res.status === 401) {
      window.location.href = "/login";
    } else if (res.status === 500) {
      window.location.href = "/error/500";
    }
    throw new Error("Erreur lors de la récupération du profil");
  }

  const data = await res.json();
  return meResponseSchema.parse(data);
}
