import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center text-primary hover:underline mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à l&apos;accueil
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">
              Politique de Confidentialité
            </CardTitle>
            <p className="text-muted-foreground">
              Dernière mise à jour : 15 janvier 2024
            </p>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none">
            <h2>1. Collecte des données</h2>
            <p>K.Kits collecte les données personnelles suivantes :</p>
            <ul>
              <li>Informations d&apos;identification (nom, email, téléphone)</li>
              <li>Données d&apos;utilisation de l&apos;application</li>
              <li>Informations techniques (adresse IP, navigateur)</li>
            </ul>

            <h2>2. Utilisation des données</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul>
              <li>Fournir et améliorer nos services</li>
              <li>Communiquer avec vous</li>
              <li>Assurer la sécurité de la plateforme</li>
              <li>Respecter nos obligations légales</li>
            </ul>

            <h2>3. Partage des données</h2>
            <p>
              Nous ne vendons jamais vos données personnelles. Nous pouvons les
              partager uniquement :
            </p>
            <ul>
              <li>Avec votre consentement explicite</li>
              <li>Pour respecter la loi</li>
              <li>Avec nos prestataires de services (sous contrat strict)</li>
            </ul>

            <h2>4. Sécurité</h2>
            <p>
              Nous mettons en place des mesures techniques et organisationnelles
              appropriées pour protéger vos données contre l&apos;accès non autorisé,
              la modification, la divulgation ou la destruction.
            </p>

            <h2>5. Vos droits</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul>
              <li>Droit d&apos;accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l&apos;effacement</li>
              <li>Droit à la portabilité</li>
              <li>Droit d&apos;opposition</li>
            </ul>

            <h2>6. Cookies</h2>
            <p>
              Nous utilisons des cookies essentiels au fonctionnement du site et
              des cookies d&apos;analyse pour améliorer votre expérience.
            </p>

            <h2>7. Contact</h2>
            <p>
              Pour toute question concernant cette politique, contactez-nous à :
              <a href="mailto:privacy@k-kits.com" className="text-primary">
                {" "}
                privacy@k-kits.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
