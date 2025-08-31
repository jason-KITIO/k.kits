import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center text-primary hover:underline mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à l'accueil
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">
              Conditions Générales d'Utilisation
            </CardTitle>
            <p className="text-muted-foreground">
              Dernière mise à jour : 15 janvier 2024
            </p>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none">
            <h2>1. Acceptation des conditions</h2>
            <p>
              En utilisant K.Kits, vous acceptez d'être lié par ces conditions
              d&apos;utilisation. Si vous n&apos;acceptez pas ces conditions, veuillez ne
              pas utiliser notre service.
            </p>

            <h2>2. Description du service</h2>
            <p>
              K.Kits est une plateforme de gestion d&apos;inventaire et de stock qui
              permet aux organisations de :
            </p>
            <ul>
              <li>Gérer leurs produits et stocks</li>
              <li>Suivre les mouvements d&apos;inventaire</li>
              <li>Générer des rapports</li>
              <li>Collaborer en équipe</li>
            </ul>

            <h2>3. Compte utilisateur</h2>
            <p>
              Pour utiliser K.Kits, vous devez créer un compte. Vous êtes
              responsable de :
            </p>
            <ul>
              <li>La confidentialité de vos identifiants</li>
              <li>Toutes les activités sous votre compte</li>
              <li>La véracité des informations fournies</li>
            </ul>

            <h2>4. Utilisation acceptable</h2>
            <p>Vous vous engagez à ne pas :</p>
            <ul>
              <li>Utiliser le service à des fins illégales</li>
              <li>Tenter d&apos;accéder aux données d&apos;autres utilisateurs</li>
              <li>Perturber le fonctionnement du service</li>
              <li>Transmettre des virus ou codes malveillants</li>
            </ul>

            <h2>5. Propriété intellectuelle</h2>
            <p>
              K.Kits et tous ses contenus sont protégés par les droits de
              propriété intellectuelle. Vous conservez la propriété de vos
              données.
            </p>

            <h2>6. Limitation de responsabilité</h2>
            <p>
              K.Kits est fourni &quot;en l&apos;état&quot;. Nous ne garantissons pas que le
              service sera ininterrompu ou exempt d&apos;erreurs.
            </p>

            <h2>7. Résiliation</h2>
            <p>
              Vous pouvez résilier votre compte à tout moment. Nous nous
              réservons le droit de suspendre ou résilier votre accès en cas de
              violation de ces conditions.
            </p>

            <h2>8. Modifications</h2>
            <p>
              Nous nous réservons le droit de modifier ces conditions à tout
              moment. Les modifications prendront effet dès leur publication.
            </p>

            <h2>9. Droit applicable</h2>
            <p>
              Ces conditions sont régies par le droit français. Tout litige sera
              soumis aux tribunaux compétents de Paris.
            </p>

            <h2>10. Contact</h2>
            <p>
              Pour toute question concernant ces conditions, contactez-nous à :
              <a href="mailto:legal@k-kits.com" className="text-primary">
                {" "}
                legal@k-kits.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
