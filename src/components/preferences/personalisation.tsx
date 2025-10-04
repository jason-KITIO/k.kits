"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Palette, Globe } from "lucide-react";
import ThemeSwitcher from "./theme-switcher";
import { ProfileForm, UserSettingsForm, SecurityForm, AccountInfo } from "@/components/profile";

const Personalization = () => {
  const [timeZone, setTimeZone] = useState<string>("Europe/Paris");
  const [dateFormat, setDateFormat] = useState<string>("dd/mm/yyyy");
  const [timeFormat, setTimeFormat] = useState<string>("24h");
  const [language, setLanguage] = useState<string>("fr");

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Personnalisation</h1>
          <p className="text-muted-foreground text-lg">
            Configurez vos préférences d&apos;affichage et de localisation
          </p>
        </div>

        {/* Profil utilisateur */}
        <div className="grid gap-6 md:grid-cols-2">
          <ProfileForm />
          <UserSettingsForm />
        </div>

        {/* Sécurité et informations du compte */}
        <div className="grid gap-6 md:grid-cols-2">
          <SecurityForm />
          <AccountInfo />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {/* Fuseau horaire */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                Mon fuseau horaire
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Les dates et heures seront affichées dans ce fuseau horaire.
              </p>
              <div className="space-y-2">
                <Label htmlFor="timezone-select">Fuseau horaire</Label>
                <Select value={timeZone} onValueChange={setTimeZone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Europe/Paris">
                      Europe/Paris (UTC+1)
                    </SelectItem>
                    <SelectItem value="America/New_York">
                      America/New_York (UTC-5)
                    </SelectItem>
                    <SelectItem value="Asia/Tokyo">
                      Asia/Tokyo (UTC+9)
                    </SelectItem>
                    <SelectItem value="UTC">UTC (UTC+0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Format de date */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                Format de date
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Choisissez comment les dates sont affichées dans l&apos;application.
              </p>
              <div className="space-y-2">
                <Label htmlFor="date-select">Format de date</Label>
                <Select value={dateFormat} onValueChange={setDateFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd/mm/yyyy">
                      DD/MM/YYYY (15/01/2024)
                    </SelectItem>
                    <SelectItem value="mm/dd/yyyy">
                      MM/DD/YYYY (01/15/2024)
                    </SelectItem>
                    <SelectItem value="yyyy-mm-dd">
                      YYYY-MM-DD (2024-01-15)
                    </SelectItem>
                    <SelectItem value="dd-mm-yyyy">
                      DD-MM-YYYY (15-01-2024)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Format d&apos;heure */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                Format d&apos;heure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Définissez le format d&apos;affichage des heures.
              </p>
              <div className="space-y-2">
                <Label htmlFor="time-select">Format d&apos;heure</Label>
                <Select value={timeFormat} onValueChange={setTimeFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24 heures (14:30)</SelectItem>
                    <SelectItem value="12h">12 heures (2:30 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Langue */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Globe className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                Langue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Sélectionnez la langue de l&apos;interface.
              </p>
              <div className="space-y-2">
                <Label htmlFor="language-select">Langue de l&apos;interface</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Apparence */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200 md:col-span-2">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-3 bg-pink-100 dark:bg-pink-900/20 rounded-lg">
                <Palette className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
              Apparence
              <Badge variant="secondary" className="ml-2">
                APERÇU
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="text-muted-foreground text-base">
                Personnalisez l&apos;apparence de l&apos;application. Ces paramètres
                contrôlent le comportement expérimental et doivent être utilisés
                avec précaution.
              </p>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-amber-800 dark:text-amber-200 text-sm flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-400">⚠️</span>
                  Note : Le mode sombre n&apos;est actuellement pas disponible pour les graphiques.
                </p>
              </div>
            </div>
            <ThemeSwitcher />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Personalization;
