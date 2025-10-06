"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette } from "lucide-react";
import ThemeSwitcher from "../theme-switcher";

export function AppearanceCard() {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200 md:col-span-2">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="p-3 bg-pink-100 dark:bg-pink-900/20 rounded-lg">
            <Palette className="h-6 w-6 text-pink-600 dark:text-pink-400" />
          </div>
          Apparence
          <Badge variant="secondary" className="ml-2">APERÇU</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <p className="text-muted-foreground text-base">
            Personnalisez l'apparence de l'application. Ces paramètres contrôlent le comportement expérimental et doivent être utilisés avec précaution.
          </p>
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-amber-800 dark:text-amber-200 text-sm flex items-start gap-2">
              <span className="text-amber-600 dark:text-amber-400">⚠️</span>
              Note : Le mode sombre n'est actuellement pas disponible pour les graphiques.
            </p>
          </div>
        </div>
        <ThemeSwitcher />
      </CardContent>
    </Card>
  );
}
