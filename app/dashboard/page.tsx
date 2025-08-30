"use client";

import { useCurrentUser } from "@/hooks/use-current-user";

export default function ProfilePage() {
  const { data, error, isLoading } = useCurrentUser();

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {(error as Error).message}</p>;

  const user = data?.user;

  if (!user) return <p>Utilisateur non trouvé ou non authentifié.</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Profil de {user.username}</h1>
      <img
        src={user.profileImageUrl || "/default-avatar.png"}
        alt={`Avatar de ${user.username}`}
        className="w-28 h-28 rounded-full mb-6"
      />
      <ul className="space-y-2 text-lg">
        <li>
          <strong>Nom complet :</strong> {user.firstName} {user.lastName}
        </li>
        <li>
          <strong>Email :</strong> {user.email}
        </li>
        <li>
          <strong>Téléphone :</strong> {user.phone || "Non renseigné"}
        </li>
        <li>
          <strong>Email vérifié :</strong> {user.emailVerified ? "Oui" : "Non"}
        </li>
        <li>
          <strong>Deux facteurs :</strong>{" "}
          {user.twoFactorEnabled ? "Activé" : "Désactivé"}
        </li>
        <li>
          <strong>Statut :</strong> {user.banned ? "Banni" : "Actif"}
        </li>
        <li>
          <strong>Dernière connexion :</strong>{" "}
          {user.lastSignInAt || "Inconnue"}
        </li>
      </ul>
    </div>
  );
}
