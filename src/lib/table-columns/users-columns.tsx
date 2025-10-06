"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowUpDown, Mail, Phone, Calendar } from "lucide-react";
import { OrganizationMember } from "@/types/organization-member";

export const usersColumns: ColumnDef<OrganizationMember>[] = [
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
            <div className="font-medium">{`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Nom non défini'}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" />{user.email}
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
      return phone ? <div className="flex items-center gap-1 text-sm"><Phone className="h-3 w-3" />{phone}</div> : 
        <span className="text-muted-foreground text-sm">Non renseigné</span>;
    },
  },
  {
    accessorKey: "role",
    header: "Rôle",
    cell: ({ row }) => {
      const role = row.original.role;
      return <Badge variant="outline" style={{ borderColor: role.color || '#6b7280', color: role.color || '#6b7280' }}>{role.name}</Badge>;
    },
  },
  {
    accessorKey: "joinedAt",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Date d'adhésion<ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm">
        <Calendar className="h-3 w-3" />{new Date(row.getValue<string>("joinedAt")).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "user.lastSignInAt",
    header: "Dernière connexion",
    cell: ({ row }) => {
      const lastSignIn = row.original.user.lastSignInAt;
      return lastSignIn ? <div className="text-sm">{new Date(lastSignIn).toLocaleDateString()}</div> : 
        <span className="text-muted-foreground text-sm">Jamais connecté</span>;
    },
  },
  {
    accessorKey: "active",
    header: "Statut",
    cell: ({ row }) => (
      <Badge variant={row.getValue<boolean>("active") ? "default" : "secondary"}>
        {row.getValue<boolean>("active") ? "Actif" : "Inactif"}
      </Badge>
    ),
  },
];
