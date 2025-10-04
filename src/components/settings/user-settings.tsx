"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Save, Upload, Shield } from "lucide-react";
import { useUserProfile, useUpdateUserProfile } from "@/hooks/use-user-settings";
import { UserSettings as UserSettingsType, UpdateUserProfile } from "@/schema/user-settings.schema";

export function UserSettings() {
  const { data: user, isLoading } = useUserProfile();
  const updateMutation = useUpdateUserProfile();
  const [formData, setFormData] = useState<UpdateUserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    settings: {
      notifications: {
        email: true,
        push: false,
        sms: false,
      },
      display: {
        darkMode: false,
        language: "fr",
        timezone: "Europe/Paris",
      },
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        settings: {
          notifications: {
            email: user.settings?.notifications?.email ?? true,
            push: user.settings?.notifications?.push ?? false,
            sms: user.settings?.notifications?.sms ?? false,
          },
          display: {
            darkMode: user.settings?.display?.darkMode ?? false,
            language: user.settings?.display?.language ?? "fr",
            timezone: user.settings?.display?.timezone ?? "Europe/Paris",
          },
        },
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMutation.mutateAsync(formData);
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user?.profileImageUrl || "/placeholder-avatar.jpg"} />
          <AvatarFallback>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Changer la photo
          </Button>
          <p className="text-sm text-muted-foreground">
            JPG, PNG ou GIF. Max 2MB.
          </p>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="first-name">Prénom</Label>
            <Input 
              id="first-name" 
              placeholder="Jason"
              value={formData.firstName || ""}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="last-name">Nom</Label>
            <Input 
              id="last-name" 
              placeholder="Kitio"
              value={formData.lastName || ""}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="jason@example.com"
            value={formData.email || ""}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input 
            id="phone" 
            placeholder="+33 6 12 34 56 78"
            value={formData.phone || ""}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Sécurité</h3>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Authentification à deux facteurs (2FA)
            </Label>
            <p className="text-sm text-muted-foreground">
              Sécurisez votre compte avec la 2FA
            </p>
          </div>
          <Badge variant="outline">Activée</Badge>
        </div>

        <Button variant="outline" size="sm">
          Changer le mot de passe
        </Button>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Préférences de notification</h3>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Notifications par email</Label>
            <p className="text-sm text-muted-foreground">
              Recevoir les notifications par email
            </p>
          </div>
          <Switch 
            checked={formData.settings?.notifications?.email ?? true}
            onCheckedChange={(checked) => 
              setFormData({
                ...formData,
                settings: {
                  ...formData.settings!,
                  notifications: { ...formData.settings!.notifications, email: checked }
                }
              })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Notifications push</Label>
            <p className="text-sm text-muted-foreground">
              Recevoir les notifications dans le navigateur
            </p>
          </div>
          <Switch 
            checked={formData.settings?.notifications?.push ?? false}
            onCheckedChange={(checked) => 
              setFormData({
                ...formData,
                settings: {
                  ...formData.settings!,
                  notifications: { ...formData.settings!.notifications, push: checked }
                }
              })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Notifications SMS</Label>
            <p className="text-sm text-muted-foreground">
              Recevoir les alertes importantes par SMS
            </p>
          </div>
          <Switch 
            checked={formData.settings?.notifications?.sms ?? false}
            onCheckedChange={(checked) => 
              setFormData({
                ...formData,
                settings: {
                  ...formData.settings!,
                  notifications: { ...formData.settings!.notifications, sms: checked }
                }
              })
            }
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Préférences d'affichage</h3>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Mode sombre</Label>
            <p className="text-sm text-muted-foreground">
              Utiliser le thème sombre
            </p>
          </div>
          <Switch 
            checked={formData.settings?.display?.darkMode ?? false}
            onCheckedChange={(checked) => 
              setFormData({
                ...formData,
                settings: {
                  ...formData.settings!,
                  display: { ...formData.settings!.display, darkMode: checked }
                }
              })
            }
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="language">Langue</Label>
          <select 
            id="language"
            title="Sélectionner la langue"
            value={formData.settings?.display?.language || "fr"}
            onChange={(e) => 
              setFormData({
                ...formData,
                settings: {
                  ...formData.settings!,
                  display: { ...formData.settings!.display, language: e.target.value as "fr" | "en" | "es" }
                }
              })
            }
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="timezone">Fuseau horaire</Label>
          <select 
            id="timezone"
            title="Sélectionner le fuseau horaire"
            value={formData.settings?.display?.timezone || "Europe/Paris"}
            onChange={(e) => 
              setFormData({
                ...formData,
                settings: {
                  ...formData.settings!,
                  display: { ...formData.settings!.display, timezone: e.target.value }
                }
              })
            }
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
            <option value="Europe/London">Europe/London (UTC+0)</option>
            <option value="America/New_York">America/New_York (UTC-5)</option>
          </select>
        </div>
      </div>

      <Separator />

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={updateMutation.isPending}>
          <Save className="h-4 w-4 mr-2" />
          {updateMutation.isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
}