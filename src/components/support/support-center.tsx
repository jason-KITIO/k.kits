"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LifeBuoy,
  Mail,
  Phone,
  MessageCircle,
  Book,
  Video,
} from "lucide-react";

export function SupportCenter() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Centre d&apos;aide</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Book className="h-5 w-5" />
              <span>Documentation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Consultez notre guide complet d&apos;utilisation
            </p>
            <Button variant="outline" className="w-full">
              Voir la documentation
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Video className="h-5 w-5" />
              <span>Tutoriels vidéo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Apprenez avec nos tutoriels pas à pas
            </p>
            <Button variant="outline" className="w-full">
              Regarder les vidéos
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>Chat en direct</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Discutez avec notre équipe support
            </p>
            <Button className="w-full">Démarrer le chat</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Email</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Envoyez-nous un email détaillé
            </p>
            <Button variant="outline" className="w-full">
              support@k-kits.com
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>Téléphone</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Appelez-nous directement
            </p>
            <Button variant="outline" className="w-full">
              +237 6XX XXX XXX
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <LifeBuoy className="h-5 w-5" />
              <span>FAQ</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Questions fréquemment posées
            </p>
            <Button variant="outline" className="w-full">
              Voir la FAQ
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Horaires de support</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Support technique</h4>
              <p className="text-sm text-muted-foreground">
                Lundi - Vendredi : 8h00 - 18h00
                <br />
                Samedi : 9h00 - 15h00
              </p>
            </div>
            <div>
              <h4 className="font-medium">Support commercial</h4>
              <p className="text-sm text-muted-foreground">
                Lundi - Vendredi : 9h00 - 17h00
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
