export async function getUserFromCookie(): Promise<string | null> {
  try {
    // Récupérer le token de session depuis les cookies
    const sessionToken = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("session_token"))
      ?.split("=")[1];

    if (!sessionToken) {
      return null;
    }

    // Appeler l'API pour récupérer l'utilisateur depuis la session
    const response = await fetch("/api/auth/session");
    if (!response.ok) {
      return null;
    }

    const sessionData = await response.json();
    return sessionData.user?.id || null;
  } catch (error) {
    console.error("Erreur récupération utilisateur:", error);
    return null;
  }
}
