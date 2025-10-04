"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserProfile } from "@/hooks/use-user-profile";
import { User, Calendar, Clock } from "lucide-react";

export function AccountInfo() {
  const { data: user, isLoading } = useUserProfile();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Informations du compte
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">ID utilisateur</p>
            <p className="text-sm font-mono">{user?.id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Statut</p>
            <Badge variant={user?.banned ? "destructive" : "default"}>
              {user?.banned ? "Banni" : "Actif"}
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Compte créé le</p>
              <p className="text-sm text-muted-foreground">
                {user?.createdAt ? formatDate(user.createdAt) : "Non disponible"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Dernière connexion</p>
              <p className="text-sm text-muted-foreground">
                {user?.lastSignInAt ? formatDate(user.lastSignInAt) : "Jamais"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Dernière modification</p>
              <p className="text-sm text-muted-foreground">
                {user?.updatedAt ? formatDate(user.updatedAt) : "Non disponible"}
              </p>
            </div>
          </div>
        </div>

        {user?.organizationMembers && user.organizationMembers.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">Organisations</p>
            <div className="space-y-2">
              {user.organizationMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <span className="text-sm">{member.organization?.name}</span>
                  <Badge variant="outline">{member.role?.name}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}