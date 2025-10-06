import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Building, Users, Shield, Mail, User } from "lucide-react";
import { InvitationList } from "@/components/invitations/invitation-list";
import { RoleList } from "@/components/roles/role-list";
import { OrganizationSettings } from "@/components/settings/organization-settings";
import { ProfileForm, UserSettingsForm } from "@/components/profile";

interface SettingsTabContentProps {
  organizationId: string;
}

export function SettingsTabContent({ organizationId }: SettingsTabContentProps) {
  return (
    <>
      <TabsContent value="organization" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Paramètres de l'organisation
            </CardTitle>
            <CardDescription>Configurez les informations et préférences de votre organisation</CardDescription>
          </CardHeader>
          <CardContent>
            <OrganizationSettings organizationId={organizationId} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="users" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestion des équipes
            </CardTitle>
            <CardDescription>Gérez les membres de votre organisation et leurs permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">La gestion des équipes sera disponible prochainement</div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="roles" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Gestion des rôles
            </CardTitle>
            <CardDescription>Créez et gérez les rôles et permissions de votre organisation</CardDescription>
          </CardHeader>
          <CardContent>
            <RoleList organizationId={organizationId} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="invitations" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Invitations d'équipe
            </CardTitle>
            <CardDescription>Invitez de nouveaux membres à rejoindre votre organisation</CardDescription>
          </CardHeader>
          <CardContent>
            <InvitationList organizationId={organizationId} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="profile" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Paramètres du profil
            </CardTitle>
            <CardDescription>Gérez vos informations personnelles et préférences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <ProfileForm />
              <UserSettingsForm />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
}
