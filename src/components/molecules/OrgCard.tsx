import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrgAvatar } from "@/components/atoms";
import { Users, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

interface OrgCardProps {
  id: string;
  name: string;
  description?: string | null;
  logo?: string | null;
  domain?: string | null;
  memberCount?: number;
  actions?: React.ReactNode;
}

export function OrgCard({ id, name, description, logo, domain, memberCount, actions }: OrgCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
      <Link href={`/preferences/organizations/${id}`} className="block">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <OrgAvatar logo={logo} name={name} />
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl truncate group-hover:text-primary transition-colors">
                  {name}
                </CardTitle>
                {domain && <p className="text-sm text-muted-foreground mt-1">{domain}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {actions}
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="line-clamp-2 mb-4">
            {description || "Aucune description disponible"}
          </CardDescription>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              {memberCount || 0}
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              Créée récemment
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
