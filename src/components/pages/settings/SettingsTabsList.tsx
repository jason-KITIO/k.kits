import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Users, Shield, Mail, User } from "lucide-react";

export function SettingsTabsList() {
  return (
    <TabsList className="grid w-full grid-cols-5">
      <TabsTrigger value="organization" className="flex items-center gap-2">
        <Building className="h-4 w-4" />
        Organisation
      </TabsTrigger>
      <TabsTrigger value="users" className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        Équipes
      </TabsTrigger>
      <TabsTrigger value="roles" className="flex items-center gap-2">
        <Shield className="h-4 w-4" />
        Rôles
      </TabsTrigger>
      <TabsTrigger value="invitations" className="flex items-center gap-2">
        <Mail className="h-4 w-4" />
        Invitations
      </TabsTrigger>
      <TabsTrigger value="profile" className="flex items-center gap-2">
        <User className="h-4 w-4" />
        Profil
      </TabsTrigger>
    </TabsList>
  );
}
