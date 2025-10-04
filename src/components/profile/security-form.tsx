"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Shield, Mail, Phone, Key } from "lucide-react";

export function SecurityForm() {
  const { data: user, isLoading } = useUserProfile();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Sécurité du compte
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statut de vérification */}
        <div className="space-y-4">
          <h3 className="font-medium">Vérifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Email vérifié</span>
              </div>
              <Badge variant={user?.emailVerified ? "default" : "destructive"}>
                {user?.emailVerified ? "Vérifié" : "Non vérifié"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Téléphone vérifié</span>
              </div>
              <Badge variant={user?.phoneVerified ? "default" : "destructive"}>
                {user?.phoneVerified ? "Vérifié" : "Non vérifié"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Authentification à deux facteurs */}
        <div className="space-y-4">
          <h3 className="font-medium">Authentification à deux facteurs</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              <div>
                <Label>2FA activée</Label>
                <p className="text-sm text-muted-foreground">
                  Protection supplémentaire pour votre compte
                </p>
              </div>
            </div>
            <Switch
              checked={user?.twoFactorEnabled || false}
              disabled
            />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4 border-t">
          {!user?.emailVerified && (
            <Button variant="outline" className="w-full">
              Vérifier mon email
            </Button>
          )}
          {!user?.phoneVerified && (
            <Button variant="outline" className="w-full">
              Vérifier mon téléphone
            </Button>
          )}
          <Button variant="outline" className="w-full">
            Changer mon mot de passe
          </Button>
          <Button 
            variant={user?.twoFactorEnabled ? "destructive" : "default"} 
            className="w-full"
          >
            {user?.twoFactorEnabled ? "Désactiver" : "Activer"} la 2FA
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}