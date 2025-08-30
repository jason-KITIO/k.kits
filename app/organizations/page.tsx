"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOrganizations } from "@/hooks/use-organizations";
import Link from "next/link";

export default function OrganizationsPage() {
  const router = useRouter();
  const { data, error, isLoading } = useOrganizations();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!data) return;

    if (data.length === 0) {
      // Pas d'organisation : on laisse afficher le message + bouton créer
      setHasChecked(true);
    } else if (data.length === 1) {
      // 1 organisation : redirection automatique
      router.replace(`/organizations/${data[0].id}`);
    } else {
      // Plusieurs organisations : affichage liste
      setHasChecked(true);
    }
  }, [data, router]);

  if (isLoading) return <p>Chargement des organisations...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  if (!hasChecked) {
    // En attente du useEffect pour décider quoi afficher
    return null;
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-center">
        <p>Vous n'avez pas encore d'organisation.</p>
        <Link href="/organizations/create" className="text-primary underline">
          Créer une organisation
        </Link>
      </div>
    );
  }

  // Plusieurs organisations => affichage liste avec liens
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Vos organisations</h1>
      <ul className="space-y-4">
        {data.map((org) => (
          <li
            key={org.id}
            className="border p-4 rounded shadow hover:shadow-md"
          >
            <Link
              href={`/organizations/${org.id}`}
              className="text-xl font-semibold text-primary"
            >
              {org.name}
            </Link>
            <p className="text-muted-foreground">{org.description}</p>
            <p className="text-sm text-muted-foreground">
              Domaine : {org.domain || "Non renseigné"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
