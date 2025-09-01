"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  BarChart3,
  Users,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  AlertTriangle,
  ArrowRightLeft,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ThemeSwitcher } from "@/components/theme-switcher";
import "../../styles/animations.css";

export function LandingPage() {
  const features = [
    {
      icon: Package,
      title: "Gestion de stock intelligente",
      description:
        "Suivez vos produits en temps réel avec des alertes automatiques de stock bas",
    },
    {
      icon: BarChart3,
      title: "Rapports & Analytics",
      description:
        "Tableaux de bord détaillés et rapports d&apos;export pour analyser vos performances",
    },
    {
      icon: Users,
      title: "Gestion d&apos;équipe",
      description: "Rôles et permissions granulaires pour votre organisation",
    },
    {
      icon: ArrowRightLeft,
      title: "Transferts & Mouvements",
      description:
        "Gérez facilement les transferts entre entrepôts et suivez tous les mouvements",
    },
    {
      icon: AlertTriangle,
      title: "Alertes intelligentes",
      description:
        "Notifications automatiques pour ruptures de stock et seuils critiques",
    },
    {
      icon: Shield,
      title: "Sécurisé & Fiable",
      description:
        "Authentification multi-facteurs et sauvegarde automatique de vos données",
    },
  ];

  const stats = [
    { number: "99.9%", label: "Disponibilité" },
    { number: "500+", label: "Organisations" },
    { number: "50K+", label: "Produits gérés" },
    { number: "24/7", label: "Support" },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-fade-in-down">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 animate-fade-in-left">
            <Image
              src="/logo.svg"
              alt="K.Kits Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-2xl font-bold text-primary">K.Kits</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6 animate-fade-in">
            <Link
              href="#features"
              className="text-sm hover:text-primary transition-all duration-300 hover:scale-105"
            >
              Fonctionnalités
            </Link>
            <Link
              href="/support"
              className="text-sm hover:text-primary transition-all duration-300 hover:scale-105"
            >
              Support
            </Link>
          </nav>
          <div className="flex items-center space-x-4 animate-fade-in-right">
            <ThemeSwitcher />
            <Link href="/login">
              <Button
                variant="ghost"
                className="transition-all duration-300 hover:scale-105"
              >
                Connexion
              </Button>
            </Link>
            <Link href="/register">
              <Button className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Commencer
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4 animate-bounce">
            <Zap className="h-3 w-3 mr-1 animate-pulse" />
            Nouvelle version disponible
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Gérez votre inventaire
            <span className="text-primary block animate-fade-in-up animation-delay-200">
              en toute simplicité
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
            K.Kits est la solution complète pour gérer vos stocks, suivre vos
            produits et optimiser votre inventaire. Parfait pour les PME et
            grandes organisations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
            <Link href="/register">
              <Button
                size="lg"
                className="w-full sm:w-auto transition-all duration-300 hover:scale-105 hover:shadow-xl glow group"
              >
                Essai gratuit 14 jours
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/api-docs">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto transition-all duration-300 hover:scale-105 hover:shadow-lg animate-shine"
              >
                Voir la démo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div className="text-center group hover:scale-105 transition-all duration-300">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2 group-hover:animate-pulse">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Une suite complète d&apos;outils pour gérer efficacement votre
              inventaire et optimiser vos opérations.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <AnimatedSection key={index} delay={index * 150}>
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                    <CardContent className="p-6">
                      <Icon className="h-12 w-12 text-primary mb-4 group-hover:animate-bounce transition-all duration-300 group-hover:text-blue-600" />
                      <h3 className="text-xl font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h3 className="text-2xl font-bold mb-8">
              Construit avec les meilleures technologies
            </h3>
          </AnimatedSection>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {[
              "Next.js 15",
              "TypeScript",
              "Prisma",
              "PostgreSQL",
              "Redis",
              "Twilio",
            ].map((tech, index) => (
              <AnimatedSection key={tech} delay={index * 100}>
                <Badge
                  variant="outline"
                  className="hover:scale-110 transition-all duration-300"
                >
                  {tech}
                </Badge>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tarifs simples et transparents
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choisissez le plan qui correspond à vos besoins. Pas de frais
              cachés.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "Gratuit",
                description: "Parfait pour débuter",
                features: [
                  "Jusqu&apos;à 100 produits",
                  "1 entrepôt",
                  "Rapports de base",
                  "Support email",
                ],
              },
              {
                name: "Pro",
                price: "19 000 FCFA/mois",
                description: "Pour les entreprises en croissance",
                features: [
                  "Produits illimités",
                  "Entrepôts illimités",
                  "Rapports avancés",
                  "Support prioritaire",
                  "API accès",
                ],
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Sur devis",
                description: "Pour les grandes organisations",
                features: [
                  "Tout de Pro",
                  "Support dédié",
                  "Formation équipe",
                  "Intégrations custom",
                ],
              },
            ].map((plan, index) => (
              <AnimatedSection key={plan.name} delay={index * 200}>
                <Card
                  className={`relative ${
                    plan.popular ? "border-primary shadow-lg" : ""
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      Populaire
                    </Badge>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold mb-2">{plan.price}</div>
                    <p className="text-muted-foreground mb-6">
                      {plan.description}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-primary mr-2" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.name === "Enterprise"
                        ? "Nous contacter"
                        : "Commencer"}
                    </Button>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h3 className="text-2xl font-bold mb-8">
              Ce que disent nos clients
            </h3>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Marie Dubois",
                role: "Directrice Logistique",
                content:
                  "K.Kits a révolutionné notre gestion de stock. Gain de temps énorme !",
              },
              {
                name: "Pierre Martin",
                role: "Gérant PME",
                content:
                  "Interface intuitive et fonctionnalités complètes. Exactement ce qu&apos;il nous fallait.",
              },
              {
                name: "Sophie Laurent",
                role: "Responsable Achats",
                content:
                  "Les alertes automatiques nous ont évité plusieurs ruptures de stock.",
              },
            ].map((testimonial, index) => (
              <AnimatedSection key={testimonial.name} delay={index * 150}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">
                      &quot;{testimonial.content}&quot;
                    </p>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up">
            Prêt à optimiser votre inventaire ?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            Rejoignez des centaines d&apos;organisations qui font confiance à
            K.Kits pour gérer leur stock.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
            <Link href="/register">
              <Button
                size="lg"
                className="transition-all duration-300 hover:scale-105 hover:shadow-xl glow group"
              >
                Commencer maintenant
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/support">
              <Button
                variant="outline"
                size="lg"
                className="transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Contacter l&apos;équipe
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center mt-8 space-x-1 animate-fade-in-up animation-delay-600">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="h-5 w-5 fill-yellow-400 text-yellow-400"
              />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              4.9/5 - Plus de 200 avis clients
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-12 animate-fade-in-up">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="animate-fade-in-left">
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src="/logo.svg"
                  alt="K.Kits Logo"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
                <span className="text-lg font-bold text-primary">K.Kits</span>
              </div>
              <p className="text-sm text-muted-foreground">
                La solution complète pour la gestion d&apos;inventaire et de
                stock.
              </p>
            </div>
            <div className="animate-fade-in-up animation-delay-200">
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#features"
                    className="hover:text-primary transition-colors duration-300"
                  >
                    Fonctionnalités
                  </Link>
                </li>
                <li>
                  <Link
                    href="/api-docs"
                    className="hover:text-primary transition-colors duration-300"
                  >
                    API
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="hover:text-primary transition-colors duration-300"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div className="animate-fade-in-up animation-delay-400">
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/feedback"
                    className="hover:text-primary transition-colors duration-300"
                  >
                    Feedback
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="hover:text-primary transition-colors duration-300"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="animate-fade-in-up animation-delay-600">
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/legal/privacy"
                    className="hover:text-primary transition-colors duration-300"
                  >
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/terms"
                    className="hover:text-primary transition-colors duration-300"
                  >
                    Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground animate-fade-in-up animation-delay-800">
            © 2025 K.Kits. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
