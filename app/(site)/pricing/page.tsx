"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { CheckCircle, X } from "lucide-react";

export default function PricingPage() {
  const { theme } = useTheme();

  const plans = [
    {
      name: "Starter",
      price: "Gratuit",
      period: "Pour toujours",
      description: "Parfait pour débuter et tester la plateforme",
      features: [
        { text: "Jusqu'à 100 produits", included: true },
        { text: "1 entrepôt", included: true },
        { text: "1 boutique", included: true },
        { text: "Rapports de base", included: true },
        { text: "Support email", included: true },
        { text: "Utilisateurs illimités", included: false },
        { text: "API accès", included: false },
        { text: "Support prioritaire", included: false }
      ],
      cta: "Commencer gratuitement",
      popular: false
    },
    {
      name: "Pro",
      price: "19 000 FCFA",
      period: "/mois",
      description: "Pour les entreprises en croissance",
      features: [
        { text: "Produits illimités", included: true },
        { text: "Entrepôts illimités", included: true },
        { text: "Boutiques illimitées", included: true },
        { text: "Rapports avancés", included: true },
        { text: "Support prioritaire", included: true },
        { text: "Utilisateurs illimités", included: true },
        { text: "API accès complet", included: true },
        { text: "Intégrations tierces", included: true }
      ],
      cta: "Essayer 14 jours gratuits",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Sur devis",
      period: "Personnalisé",
      description: "Pour les grandes organisations",
      features: [
        { text: "Tout de Pro inclus", included: true },
        { text: "Support dédié 24/7", included: true },
        { text: "Formation équipe", included: true },
        { text: "Intégrations custom", included: true },
        { text: "SLA garanti", included: true },
        { text: "Domaine personnalisé", included: true },
        { text: "Branding custom", included: true },
        { text: "Conformité avancée", included: true }
      ],
      cta: "Nous contacter",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={theme === "dark" ? "/logo1.svg" : "/logo.svg"}
              alt="K.Kits"
              width={32}
              height={32}
            />
            <span className="text-2xl font-bold text-primary">K.Kits</span>
          </Link>
          <Link href="/">
            <Button variant="ghost">Retour</Button>
          </Link>
        </div>
      </header>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Tarifs simples et transparents
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choisissez le plan qui correspond à vos besoins. Pas de frais cachés, 
              pas d'engagement. Changez ou annulez à tout moment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${
                  plan.popular ? "border-primary shadow-xl scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    Le plus populaire
                  </Badge>
                )}
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        {feature.included ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={feature.included ? "" : "text-muted-foreground"}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link href={plan.name === "Enterprise" ? "/contact" : "/register"}>
                      {plan.cta}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-4">Questions fréquentes</h3>
            <div className="max-w-3xl mx-auto space-y-4 text-left">
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-2">Puis-je changer de plan à tout moment ?</h4>
                  <p className="text-muted-foreground">
                    Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. 
                    Les changements sont appliqués immédiatement.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-2">Y a-t-il des frais cachés ?</h4>
                  <p className="text-muted-foreground">
                    Non, tous nos tarifs sont transparents. Aucun frais caché ou surprise.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-2">Quelle est la durée de l'essai gratuit ?</h4>
                  <p className="text-muted-foreground">
                    14 jours complets sans carte bancaire requise pour le plan Pro.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
