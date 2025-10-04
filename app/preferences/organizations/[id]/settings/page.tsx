"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, Mail, Shield, Building, User } from "lucide-react";
import { InvitationList } from "@/components/invitations/invitation-list";
import { RoleList } from "@/components/roles/role-list";
import { OrganizationSettings } from "@/components/settings/organization-settings";
import { UserSettings } from "@/components/settings/user-settings";
import { ProfileForm, UserSettingsForm } from "@/components/profile";

export default function SettingsPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const [activeTab, setActiveTab] = useState("organization");

  return (
    <div className="space-y-6 p-6">
      <div className="border-b pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
            <p className="text-muted-foreground">
              Gérez votre organisation et vos préférences
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
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

        <TabsContent value="organization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Paramètres de l'organisation
              </CardTitle>
              <CardDescription>
                Configurez les informations et préférences de votre organisation
              </CardDescription>
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
              <CardDescription>
                Gérez les membres de votre organisation et leurs permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                La gestion des équipes sera disponible prochainement
              </div>
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
              <CardDescription>
                Créez et gérez les rôles et permissions de votre organisation
              </CardDescription>
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
              <CardDescription>
                Invitez de nouveaux membres à rejoindre votre organisation
              </CardDescription>
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
              <CardDescription>
                Gérez vos informations personnelles et préférences
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Profil utilisateur */}
              <div className="grid gap-6 md:grid-cols-2">
                <ProfileForm />
                <UserSettingsForm />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
