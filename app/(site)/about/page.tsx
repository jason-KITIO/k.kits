"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Target, Users, Zap, Heart } from "lucide-react";

export default function AboutPage() {
  const { theme } = useTheme();

  const values = [
    {
      icon: Target,
      title: "Mission",
      description: "Simplifier la gestion d'inventaire pour toutes les entreprises, quelle que soit leur taille."
    },
    {
      icon: Users,
      title: "Équipe",
      description: "Une équipe passionnée de développeurs et experts en logistique dédiés à votre succès."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Nous innovons constamment pour vous offrir les meilleures fonctionnalités du marché."
    },
    {
      icon: Heart,
      title: "Engagement",
      description: "Votre satisfaction est notre priorité. Support réactif et écoute permanente."
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
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              À propos de K.Kits
            </h1>
            <p className="text-xl text-muted-foreground">
              La solution de gestion d'inventaire pensée pour vous
            </p>
          </div>

          <div className="prose prose-lg dark:prose-invert mx-auto mb-16">
            <p className="text-lg leading-relaxed">
              K.Kits est né d'un constat simple : la gestion d'inventaire est souvent 
              complexe, coûteuse et inadaptée aux besoins réels des entreprises. 
              Nous avons créé une solution moderne, intuitive et accessible qui permet 
              à toute organisation de gérer efficacement son stock.
            </p>
            <p className="text-lg leading-relaxed">
              Depuis notre lancement, nous avons aidé des centaines d'entreprises à 
              optimiser leur gestion de stock, réduire leurs coûts et améliorer leur 
              productivité. Notre plateforme évolue constamment grâce aux retours de 
              nos utilisateurs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <Icon className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="bg-muted/50">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Notre vision</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Devenir la référence mondiale en matière de gestion d'inventaire, 
                en offrant une solution accessible, performante et innovante qui 
                accompagne la croissance de chaque entreprise.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg">Rejoignez-nous</Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">Contactez-nous</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
