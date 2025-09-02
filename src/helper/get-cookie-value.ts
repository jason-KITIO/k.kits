/**
 * Vérifie si l'utilisateur est authentifié en appelant une API.
 * @returns {Promise<Object>} Un objet contenant les données de l'utilisateur ou une erreur.
 */
export async function checkAuthentication() {
  try {
    const response = await fetch('/api/auth/me'); // Remplacez par le point de terminaison de votre API
    
    if (!response.ok) {
      // Si le statut de la réponse n'est pas 2xx
      const errorData = await response.json();
      console.error('Erreur d\'authentification:', errorData.error);
      return { authenticated: false, error: errorData.error };
    }
    
    // Si la réponse est OK, l'utilisateur est authentifié.
    const userData = await response.json();
    return { authenticated: true, user: userData.user }; // Supposons que l'API renvoie les données de l'utilisateur
    
  } catch (error) {
    console.error('Échec de la connexion au serveur:', error);
    return { authenticated: false, error: 'Échec de la connexion au serveur.' };
  }
}