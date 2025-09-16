"use client";

import { usePermissions } from "@/hooks/use-permissions";
import { PermissionGuard } from "./permission-guard";
import { PERMISSIONS } from "@/lib/permissions";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Shield, Users, Settings, BarChart3 } from "lucide-react";

interface PermissionExamplesProps {
  organizationId: string;
}

export function PermissionExamples({ organizationId }: PermissionExamplesProps) {
  const { can, is, permissions } = usePermissions(organizationId);

  return (
    <div className="space-y-6">
      {/* Informations sur le rôle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Vos permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Rôle actuel</h4>
              <div className="flex gap-2">
                {is.owner && <Badge variant="destructive">Propriétaire</Badge>}
                {is.manager && <Badge variant="default">Gestionnaire</Badge>}
                {is.seller && <Badge variant="secondary">Vendeur</Badge>}
                {is.stockManager && <Badge variant="outline">Magasinier</Badge>}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Permissions ({permissions.length})</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className={can.viewDashboard ? "text-green-600" : "text-muted-foreground"}>
                    Tableau de bord
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className={can.manageUsers ? "text-green-600" : "text-muted-foreground"}>
                    Gestion équipe
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className={can.manageSettings ? "text-green-600" : "text-muted-foreground"}>
                    Paramètres
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exemples de protection par permissions */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Section réservée aux gestionnaires */}
        <PermissionGuard 
          requiredPermission={PERMISSIONS.USER_MANAGE}
          organizationId={organizationId}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Section Gestionnaire</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Cette section n'est visible que pour les gestionnaires et propriétaires.
              </p>
              <Button size="sm">
                Gérer l'équipe
              </Button>
            </CardContent>
          </Card>
        </PermissionGuard>

        {/* Section réservée aux propriétaires */}
        <PermissionGuard 
          requiredPermission={PERMISSIONS.ORG_SETTINGS}
          organizationId={organizationId}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Section Propriétaire</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Cette section n'est visible que pour les propriétaires.
              </p>
              <Button size="sm" variant="destructive">
                Paramètres avancés
              </Button>
            </CardContent>
          </Card>
        </PermissionGuard>
      </div>

      {/* Rendu conditionnel avec les permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {can.createSale && (
              <Button size="sm" variant="outline">
                Nouvelle vente
              </Button>
            )}
            {can.adjustStock && (
              <Button size="sm" variant="outline">
                Ajuster stock
              </Button>
            )}
            {can.inviteUsers && (
              <Button size="sm" variant="outline">
                Inviter membre
              </Button>
            )}
            {can.viewReports && (
              <Button size="sm" variant="outline">
                Voir rapports
              </Button>
            )}
            {!can.createSale && !can.adjustStock && !can.inviteUsers && !can.viewReports && (
              <p className="text-sm text-muted-foreground">
                Aucune action disponible avec vos permissions actuelles.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}