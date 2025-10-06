"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface DisplaySettingsProps {
  darkMode: boolean;
  language: string;
  timezone: string;
  onChange: (field: "darkMode" | "language" | "timezone", value: boolean | string) => void;
}

export function DisplaySettings({ darkMode, language, timezone, onChange }: DisplaySettingsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Préférences d'affichage</h3>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Mode sombre</Label>
          <p className="text-sm text-muted-foreground">Utiliser le thème sombre</p>
        </div>
        <Switch checked={darkMode} onCheckedChange={(checked) => onChange("darkMode", checked)} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="language">Langue</Label>
        <select
          id="language"
          title="Sélectionner la langue"
          value={language}
          onChange={(e) => onChange("language", e.target.value)}
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
          value={timezone}
          onChange={(e) => onChange("timezone", e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
          <option value="Europe/London">Europe/London (UTC+0)</option>
          <option value="America/New_York">America/New_York (UTC-5)</option>
        </select>
      </div>
    </div>
  );
}
