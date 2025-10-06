"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

export function SecuritySection() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Sécurité</h3>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Authentification à deux facteurs (2FA)
          </Label>
          <p className="text-sm text-muted-foreground">Sécurisez votre compte avec la 2FA</p>
        </div>
        <Badge variant="outline">Activée</Badge>
      </div>

      <Button variant="outline" size="sm">
        Changer le mot de passe
      </Button>
    </div>
  );
}
