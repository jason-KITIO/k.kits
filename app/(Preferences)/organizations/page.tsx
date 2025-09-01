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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building2,
  Plus,
  Users,
  ArrowRight,
  Loader2,
  Grid3X3,
  List,
  Calendar,
  MapPin,
} from "lucide-react";

export default function OrganizationsPage() {
  const router = useRouter();
  const { data, error, isLoading } = useOrganizations();
  const [hasChecked, setHasChecked] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

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
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Mes organisations
            </h1>
            <p className="text-gray-600 mt-1">
              Gérez et accédez à vos organisations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white rounded-lg border p-1">
              <Button
                variant={viewMode === "cards" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className="h-8"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-8"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button asChild>
              <Link href="/organizations/create">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle organisation
              </Link>
            </Button>
          </div>
        </div>

        {viewMode === "cards" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.map((org) => (
              <Card
                key={org.id}
                className="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-white"
              >
                <Link href={`/organizations/${org.id}`} className="block">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-xl truncate group-hover:text-blue-600 transition-colors">
                            {org.name}
                          </CardTitle>
                          {org.domain && (
                            <p className="text-sm text-gray-500 mt-1">
                              {org.domain}
                            </p>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="line-clamp-2 mb-4 text-gray-600">
                      {org.description || "Aucune description disponible"}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="text-xs bg-gray-100"
                      >
                        <Users className="h-3 w-3 mr-1" />
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        Créée récemment
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Liste des organisations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organisation</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Domaine</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((org) => (
                    <TableRow key={org.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{org.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate text-gray-600">
                          {org.description || "Aucune description"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {org.domain ? (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="h-3 w-3" />
                            {org.domain}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/organizations/${org.id}`}>
                            Accéder
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
