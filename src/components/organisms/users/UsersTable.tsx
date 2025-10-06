"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { usersColumns } from "@/lib/table-columns/users-columns";
import { OrganizationMember } from "@/types/organization-member";

export function UsersTable({ members }: { members: OrganizationMember[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des utilisateurs</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={usersColumns} data={members} searchKey="user" searchPlaceholder="Rechercher un utilisateur..." />
      </CardContent>
    </Card>
  );
}
