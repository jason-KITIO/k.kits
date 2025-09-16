"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConditionalRender } from "@/hooks/use-permissions";
import { 
  ShoppingCart, 
  Package, 
  Users, 
  ArrowRightLeft, 
  AlertTriangle,
  FileText,
  Settings
} from "lucide-react";

interface DashboardActionsProps {
  organizationId: string;
}

export function DashboardActions({ organizationId }: DashboardActionsProps) {
  const { renderIfCan, renderIfIs, can } = useConditionalRender(organizationId);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Actions de vente */}
      {renderIfCan("createSale", (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouvelle Vente</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button className="w-full">Créer une vente</Button>
          </CardContent>
        </Card>
      ))}

      {/* Gestion des produits */}
      {renderIfCan("createProduct", (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Gérer les produits</Button>
          </CardContent>
        </Card>
      ))}

      {/* Transfert de stock */}
      {renderIfCan("transferStock", (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transfert Stock</CardTitle>
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Nouveau transfert</Button>
          </CardContent>
        </Card>
      ))}

      {/* Alertes stock (visible pour tous ceux qui peuvent voir le stock) */}
      {renderIfCan("viewStock", (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Voir les alertes</Button>
          </CardContent>
        </Card>
      ))}

      {/* Gestion des utilisateurs - Managers et Owners seulement */}
      {renderIfCan("manageUsers", (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Équipe</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Gérer l'équipe</Button>
          </CardContent>
        </Card>
      ))}

      {/* Rapports - Managers et Owners */}
      {renderIfCan("viewReports", (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rapports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Voir les rapports</Button>
          </CardContent>
        </Card>
      ))}

      {/* Paramètres - Owners seulement */}
      {renderIfIs("owner", (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paramètres</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Configurer</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Composant pour afficher le rôle de l'utilisateur
export function UserRoleBadge({ organizationId }: { organizationId: string }) {
  const { is } = useConditionalRender(organizationId);

  const getRoleInfo = () => {
    if (is.owner) return { label: "Propriétaire", color: "bg-red-100 text-red-800" };
    if (is.manager) return { label: "Gestionnaire", color: "bg-orange-100 text-orange-800" };
    if (is.seller) return { label: "Vendeur", color: "bg-green-100 text-green-800" };
    if (is.stockManager) return { label: "Magasinier", color: "bg-blue-100 text-blue-800" };
    return { label: "Utilisateur", color: "bg-gray-100 text-gray-800" };
  };

  const { label, color } = getRoleInfo();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}