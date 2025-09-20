"use client";

import { useParams } from "next/navigation";
import { useOrganizationUsers } from "@/hooks/useOrganization";
import { DataTable } from "@/components/ui/data-table";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, UserPlus, Mail, Phone, Calendar } from "lucide-react";
import { OrganizationMember } from "@/types/organization-member";
import Link from "next/link";

const columns: ColumnDef<OrganizationMember>[] = [
  {
    accessorKey: "user",
    header: "Utilisateur",
    cell: ({ row }) => {
      const user = row.original.user;
      const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
      
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{initials || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">
              {`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Nom non défini'}
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {user.email}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "user.phone",
    header: "Téléphone",
    cell: ({ row }) => {
      const phone = row.original.user.phone;
      return phone ? (
        <div className="flex items-center gap-1 text-sm">
          <Phone className="h-3 w-3" />
          {phone}
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">Non renseigné</span>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Rôle",
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <Badge 
          variant="outline" 
          style={{ 
            borderColor: role.color || '#6b7280',
            color: role.color || '#6b7280'
          }}
        >
          {role.name}
        </Badge>
      );
    },
  },
  {
    accessorKey: "joinedAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date d'adhésion
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm">
        <Calendar className="h-3 w-3" />
        {new Date(row.getValue<string>("joinedAt")).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "user.lastSignInAt",
    header: "Dernière connexion",
    cell: ({ row }) => {
      const lastSignIn = row.original.user.lastSignInAt;
      return lastSignIn ? (
        <div className="text-sm">
          {new Date(lastSignIn).toLocaleDateString()}
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">Jamais connecté</span>
      );
    },
  },
  {
    accessorKey: "active",
    header: "Statut",
    cell: ({ row }) => {
      const active = row.getValue<boolean>("active");
      return (
        <Badge variant={active ? "default" : "secondary"}>
          {active ? "Actif" : "Inactif"}
        </Badge>
      );
    },
  },
];

export default function UsersPage() {
  const params = useParams();
  const organizationId = params.id as string;

  const { data: members, isLoading, error } = useOrganizationUsers(organizationId);

  if (isLoading) return <PageLoader text="Chargement des utilisateurs..." />;
  if (error) return <div>Erreur: {error.message}</div>;

  const activeMembers = members?.filter((m: OrganizationMember) => m.active).length || 0;
  const totalMembers = members?.length || 0;
  const recentJoins = members?.filter((m: OrganizationMember) => {
    const joinDate = new Date(m.joinedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return joinDate > weekAgo;
  }).length || 0;

  // Grouper par rôles
  const roleStats = members?.reduce((acc: Record<string, number>, member: OrganizationMember) => {
    const roleName = member.role.name;
    acc[roleName] = (acc[roleName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Utilisateurs</h1>
          <p className="text-muted-foreground">
            Gestion des membres de votre organisation
          </p>
        </div>
        <Button asChild>
          <Link href={`/preferences/organizations/${organizationId}/invitation`}>
            <UserPlus className="h-4 w-4 mr-2" />
            Inviter un utilisateur
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total membres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">Utilisateurs inscrits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Membres actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeMembers}</div>
            <p className="text-xs text-muted-foreground">Comptes actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux (7j)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{recentJoins}</div>
            <p className="text-xs text-muted-foreground">Récemment ajoutés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rôles différents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(roleStats).length}</div>
            <p className="text-xs text-muted-foreground">Types de rôles</p>
          </CardContent>
        </Card>
      </div>

      {Object.keys(roleStats).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Répartition par rôles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(roleStats).map(([role, count]) => (
                <div key={role} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <span className="font-medium">{role}</span>
                  <Badge variant="secondary">{(count as number).toString()}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={members || []}
            searchKey="user"
            searchPlaceholder="Rechercher un utilisateur..."
          />
        </CardContent>
      </Card>
    </div>
  );
}