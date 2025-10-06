import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrganizationMember } from "@/types/organization-member";

export function UsersStats({ members }: { members: OrganizationMember[] }) {
  const activeMembers = members.filter(m => m.active).length;
  const recentJoins = members.filter(m => {
    const joinDate = new Date(m.joinedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return joinDate > weekAgo;
  }).length;
  const roleStats = members.reduce((acc, member) => {
    acc[member.role.name] = (acc[member.role.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total membres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{members.length}</div>
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
  );
}
