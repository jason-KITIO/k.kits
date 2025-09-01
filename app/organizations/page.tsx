"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOrganizations } from "@/hooks/use-organizations";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Users, ArrowRight, Loader2 } from "lucide-react";

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Chargement des organisations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <p className="font-medium">Erreur de chargement</p>
              <p className="text-sm text-muted-foreground mt-1">
                {error.message}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasChecked) {
    // En attente du useEffect pour décider quoi afficher
    return null;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Aucune organisation</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Créez votre première organisation pour commencer
                </p>
              </div>
              <Button asChild>
                <Link href="/organizations/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer une organisation
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Plusieurs organisations => affichage liste avec liens
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Vos organisations
          </h1>
          <p className="text-muted-foreground mt-1">
            Sélectionnez une organisation pour accéder au tableau de bord
          </p>
        </div>
        <Button asChild>
          <Link href="/organizations/create">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle organisation
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map((org) => (
          <Card
            key={org.id}
            className="group hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            <Link href={`/organizations/${org.id}`} className="block">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
                        {org.name}
                      </CardTitle>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="line-clamp-2 mb-3">
                  {org.description || "Aucune description disponible"}
                </CardDescription>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    {/* {org._count?.members || 0} membre
                    {(org._count?.members || 0) > 1 ? "s" : ""} */}
                  </Badge>
                  {org.domain && (
                    <span className="text-xs text-muted-foreground truncate ml-2">
                      {org.domain}
                    </span>
                  )}
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
