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

const Personalization = () => {
  const [timeZone, setTimeZone] = useState<string>("Europe/Paris");
  const [dateFormat, setDateFormat] = useState<string>("dd/mm/yyyy");
  const [timeFormat, setTimeFormat] = useState<string>("24h");
  const [language, setLanguage] = useState<string>("fr");

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Personnalisation</h1>
          <p className="text-gray-600 mt-1">
            Configurez vos préférences d&apos;affichage et de localisation
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Fuseau horaire */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Mon fuseau horaire
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">
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
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Format de date
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">
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
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                Format d&apos;heure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">
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
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-orange-600" />
                Langue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">
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
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-pink-600" />
              Apparence
              <Badge variant="secondary" className="ml-2 text-xs">
                APERÇU
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-gray-600 text-sm">
                Personnalisez l&apos;apparence de l&apos;application. Ces paramètres
                contrôlent le comportement expérimental et doivent être utilisés
                avec précaution.
              </p>
              <p className="text-amber-600 text-xs bg-amber-50 p-2 rounded">
                Note : Le mode sombre n&apos;est actuellement pas disponible pour les
                graphiques.
              </p>
            </div>
            <ThemeSwitcher />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Personalization;
