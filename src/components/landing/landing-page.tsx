"use client";

import * as React from "react";
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
  AlertTriangle,
  ArrowRightLeft,
  LogOut,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useAuth } from "@/providers/auth-provider";
import { useLogout } from "@/hooks/use-logout";
import { useTheme } from "next-themes";
import "../../styles/animations.css";

export function LandingPage() {
  const { user, isLoading } = useAuth();
  const logout = useLogout();
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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
          <div className="flex flex-row items-center space-x-2 animate-fade-in-left">
            <Image
              src={theme === "dark" ? "/logo1.svg" : "/logo.svg"}
              alt="K.Kits Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-2xl font-bold text-primary h-6">K.Kits</span>
            <Badge variant="secondary" className="text-xs">
              BETA
            </Badge>
          </div>
          <nav className="hidden md:flex items-center space-x-6 animate-fade-in"></nav>
          <div className="flex items-center space-x-4 animate-fade-in-right">
            <ThemeSwitcher />
            {mounted &&
              !isLoading &&
              (user ? (
                // Utilisateur connecté
                <>
                  <Link href="/preferences">
                    <Button
                      variant="ghost"
                      className="transition-all duration-300 hover:scale-105"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => logout.mutate()}
                    disabled={logout.isPending}
                    className="transition-all duration-300 hover:scale-105"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {logout.isPending ? "..." : "Déconnexion"}
                  </Button>
                </>
              ) : (
                // Utilisateur non connecté
                <>
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
                </>
              ))}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 md:py-32 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-6 animate-bounce shadow-sm">
            <Zap className="h-3 w-3 mr-1 animate-pulse" />
            Essai gratuit 14 jours • Sans carte bancaire
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-fade-in-up tracking-tight">
            Gérez votre inventaire
            <span className="text-primary block mt-2 animate-fade-in-up animation-delay-200 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              en toute simplicité
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto animate-fade-in-up animation-delay-400 leading-relaxed">
            La solution complète pour gérer vos stocks, suivre vos produits et
            optimiser votre inventaire.
            <span className="font-semibold text-foreground">
              Rejoignez 500+ organisations
            </span>{" "}
            qui nous font confiance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
            {mounted && user ? (
              <Link href="/preferences">
                <Button
                  size="lg"
                  className="w-full sm:w-auto transition-all duration-300 hover:scale-105 hover:shadow-xl glow group"
                >
                  Accéder au Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div className="text-center group hover:scale-110 transition-all duration-300">
                  <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform">
                    {stat.number}
                  </div>
                  <div className="text-sm md:text-base font-medium text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 md:py-32 px-4">
        <div className="container mx-auto">
          <AnimatedSection className="text-center mb-20">
            <Badge variant="outline" className="mb-4">
              Fonctionnalités
            </Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Une suite complète d&apos;outils pour gérer efficacement votre
              inventaire et optimiser vos opérations.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <AnimatedSection key={index} delay={index * 150}>
                  <Card className="border-2 hover:border-primary/50 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group bg-gradient-to-br from-background to-muted/20">
                    <CardContent className="p-8">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
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

      {/* CTA */}
      <section className="py-24 md:py-32 px-4 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 animate-fade-in-up tracking-tight">
            Prêt à optimiser votre inventaire ?
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto animate-fade-in-up animation-delay-200 leading-relaxed">
            Rejoignez des centaines d&apos;organisations qui font confiance à
            K.Kits pour gérer leur stock.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
            {mounted && user ? (
              <Link href="/preferences">
                <Button
                  size="lg"
                  className="transition-all duration-300 hover:scale-105 hover:shadow-xl glow group"
                >
                  Accéder au Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            ) : (
              <Link href="/register">
                <Button
                  size="lg"
                  className="transition-all duration-300 hover:scale-105 hover:shadow-xl glow group"
                >
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            )}
            <Link href="/feedback">
              <Button
                variant="outline"
                size="lg"
                className="transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Nous contacter
              </Button>
            </Link>
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
                  src={theme === "dark" ? "/logo1.svg" : "/logo.svg"}
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
                    href="/api-docs"
                    className="hover:text-primary transition-colors duration-300"
                  >
                    Documentation API
                  </Link>
                </li>
              </ul>
            </div>
            <div className="animate-fade-in-up animation-delay-400">
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/feedback"
                    className="hover:text-primary transition-colors duration-300"
                  >
                    Nous contacter
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
