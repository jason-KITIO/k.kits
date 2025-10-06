import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrganizationMember } from "@/types/organization-member";

export function RoleDistribution({ members }: { members: OrganizationMember[] }) {
  const roleStats = members.reduce((acc, member) => {
    acc[member.role.name] = (acc[member.role.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (Object.keys(roleStats).length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition par rôles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(roleStats).map(([role, count]) => (
            <div key={role} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
              <span className="font-medium">{role}</span>
              <Badge variant="secondary">{count}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
