"use client";

import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface OrganizationSystemInfoProps {
  organizationId: string;
}

export function OrganizationSystemInfo({ organizationId }: OrganizationSystemInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informations système</h3>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <Label className="text-muted-foreground">ID Organisation</Label>
          <p className="font-mono">{organizationId}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Plan actuel</Label>
          <Badge variant="default">Premium</Badge>
        </div>
        <div>
          <Label className="text-muted-foreground">Créée le</Label>
          <p>15 janvier 2024</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Dernière modification</Label>
          <p>Il y a 2 jours</p>
        </div>
      </div>
    </div>
  );
}
