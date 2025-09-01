"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Key,
  AlertTriangle,
  Settings,
  Download,
} from "lucide-react";

const Legacy2FA = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [authMethod] = useState<"sms" | "app">("app");

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            Authentification à deux facteurs
          </h1>
          <p className="text-gray-600 mt-1">
            Renforcez la sécurité de votre compte
          </p>
        </div>

        {/* Alerte de dépréciation */}
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>
              L&apos;authentification 2FA héritée est désormais obsolète.
            </strong>
            <br />
            Configurez l&apos;authentification multifacteur (MFA) pour votre compte{" "}
            <a href="#" className="underline font-medium hover:text-amber-900">
              ici
            </a>
            .
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Statut actuel */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {is2FAEnabled ? (
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                ) : (
                  <ShieldAlert className="h-5 w-5 text-red-600" />
                )}
                Statut de la 2FA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    Authentification à deux facteurs
                  </p>
                  <p className="text-sm text-gray-600">
                    {is2FAEnabled ? "Activée" : "Désactivée"}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="2fa-toggle" className="sr-only">
                    Activer la 2FA
                  </Label>
                  <Switch
                    id="2fa-toggle"
                    checked={is2FAEnabled}
                    onCheckedChange={setIs2FAEnabled}
                  />
                </div>
              </div>

              <Badge
                variant={is2FAEnabled ? "default" : "destructive"}
                className="w-fit"
              >
                {is2FAEnabled ? "Sécurisé" : "Vulnérable"}
              </Badge>
            </CardContent>
          </Card>

          {/* Méthodes d&apos;authentification */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-purple-600" />
                Méthodes disponibles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">
                        Application d&apos;authentification
                      </p>
                      <p className="text-sm text-gray-600">
                        Google Authenticator, Authy
                      </p>
                    </div>
                  </div>
                  <Badge variant={authMethod === "app" ? "default" : "outline"}>
                    {authMethod === "app" ? "Actif" : "Disponible"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">SMS</p>
                      <p className="text-sm text-gray-600">Code par message</p>
                    </div>
                  </div>
                  <Badge variant={authMethod === "sms" ? "default" : "outline"}>
                    {authMethod === "sms" ? "Actif" : "Disponible"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration */}
        {is2FAEnabled && (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-gray-700 mb-2">
                    Utilisez le bouton à droite pour modifier votre numéro,
                    changer de méthode d&apos;authentification ou générer des codes
                    de récupération.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Codes de récupération
                    </Button>
                  </div>
                </div>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Legacy2FA;
