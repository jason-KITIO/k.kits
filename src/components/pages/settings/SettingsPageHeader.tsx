import { Settings } from "lucide-react";

export function SettingsPageHeader() {
  return (
    <div className="border-b pb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">Gérez votre organisation et vos préférences</p>
        </div>
      </div>
    </div>
  );
}
