import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import Link from "next/link";

interface UsersPageHeaderProps {
  organizationId: string;
}

export function UsersPageHeader({ organizationId }: UsersPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Utilisateurs</h1>
        <p className="text-muted-foreground">Gestion des membres de votre organisation</p>
      </div>
      <Button asChild>
        <Link href={`/preferences/organizations/${organizationId}/invitation`}>
          <UserPlus className="h-4 w-4 mr-2" />
          Inviter un utilisateur
        </Link>
      </Button>
    </div>
  );
}
