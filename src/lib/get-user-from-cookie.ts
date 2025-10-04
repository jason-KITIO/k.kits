import { cookies } from 'next/headers';

export async function getUserFromCookie(): Promise<string | null> {
  try {
    // Récupérer le token de session depuis les cookies côté serveur
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return null;
    }

    // Retourner directement le token pour utilisation dans les middlewares
    return sessionToken;
  } catch (error) {
    console.error("Erreur récupération utilisateur:", error);
    return null;
  }
}
