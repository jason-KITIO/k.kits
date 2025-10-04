"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { userSettingsSchema, type UserSettings } from "@/schema/user-settings.schema";
import { useUserProfile, useUpdateUserProfile } from "@/hooks/use-user-profile";
import { useEffect } from "react";
import { toast } from "sonner";

export function UserSettingsForm() {
  const { data: user, isLoading } = useUserProfile();
  const updateProfile = useUpdateUserProfile();

  const form = useForm<UserSettings>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      display: {
        darkMode: false,
        language: "fr",
        timezone: "Africa/Douala",
      },
    },
  });

  useEffect(() => {
    if (user?.settings) {
      form.reset(user.settings as any);
    }
  }, [user, form]);

  const onSubmit = async (data: UserSettings) => {
    try {
      await updateProfile.mutateAsync({ settings: data });
      toast.success("Paramètres mis à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour des paramètres");
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Notifications par email</Label>
                <Switch
                  id="email-notifications"
                  checked={form.watch("notifications.email")}
                  onCheckedChange={(checked) => 
                    form.setValue("notifications.email", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications">Notifications push</Label>
                <Switch
                  id="push-notifications"
                  checked={form.watch("notifications.push")}
                  onCheckedChange={(checked) => 
                    form.setValue("notifications.push", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-notifications">Notifications SMS</Label>
                <Switch
                  id="sms-notifications"
                  checked={form.watch("notifications.sms")}
                  onCheckedChange={(checked) => 
                    form.setValue("notifications.sms", checked)
                  }
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Affichage</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode">Mode sombre</Label>
                <Switch
                  id="dark-mode"
                  checked={form.watch("display.darkMode")}
                  onCheckedChange={(checked) => 
                    form.setValue("display.darkMode", checked)
                  }
                />
              </div>
              <div>
                <Label htmlFor="language">Langue</Label>
                <Select
                  value={form.watch("display.language")}
                  onValueChange={(value) => 
                    form.setValue("display.language", value as "fr" | "en" | "es")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timezone">Fuseau horaire</Label>
                <Select
                  value={form.watch("display.timezone")}
                  onValueChange={(value) => 
                    form.setValue("display.timezone", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Africa/Douala">Afrique/Douala</SelectItem>
                    <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                    <SelectItem value="America/New_York">Amérique/New York</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={updateProfile.isPending}
            className="w-full"
          >
            {updateProfile.isPending ? "Mise à jour..." : "Sauvegarder les paramètres"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}