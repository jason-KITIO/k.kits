"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Package, BarChart3, Users, AlertTriangle, ArrowRightLeft, Shield, Bell, FileText, Smartphone, Cloud, Lock, Zap } from "lucide-react";

export default function FeaturesPage() {
  const { theme } = useTheme();

  const features = [
    {
      icon: Package,
      title: "Gestion de produits complète",
      description: "Ajoutez, modifiez et organisez vos produits avec catégories, SKU, codes-barres et images.",
      details: ["Catégories hiérarchiques", "Import/Export CSV", "Codes-barres automatiques", "Gestion des variantes"]
    },
    {
      icon: BarChart3,
      title: "Rapports & Analytics",
      description: "Tableaux de bord en temps réel avec métriques clés et rapports personnalisables.",
      details: ["Dashboard interactif", "Rapports de ventes", "Analyse des mouvements", "Export PDF/Excel"]
    },
    {
      icon: Users,
      title: "Gestion d'équipe avancée",
      description: "Rôles et permissions granulaires pour contrôler l'accès de chaque membre.",
      details: ["Rôles personnalisables", "25+ permissions", "Invitations par email", "Audit trail complet"]
    },
    {
      icon: ArrowRightLeft,
      title: "Transferts de stock",
      description: "Gérez les mouvements entre entrepôts et boutiques avec traçabilité complète.",
      details: ["Transferts multi-sites", "Historique détaillé", "Validation workflow", "Notifications automatiques"]
    },
    {
      icon: AlertTriangle,
      title: "Alertes intelligentes",
      description: "Notifications automatiques pour stocks bas, ruptures et seuils critiques.",
      details: ["Seuils personnalisables", "Alertes email/SMS", "Prévisions de rupture", "Rapports d'alertes"]
    },
    {
      icon: Shield,
      title: "Sécurité renforcée",
      description: "Authentification 2FA, chiffrement des données et sauvegardes automatiques.",
      details: ["2FA obligatoire", "Chiffrement SSL", "Backups quotidiens", "Conformité RGPD"]
    },
    {
      icon: Bell,
      title: "Notifications en temps réel",
      description: "Restez informé de tous les événements importants de votre inventaire.",
      details: ["Notifications push", "Alertes personnalisées", "Centre de notifications", "Historique complet"]
    },
    {
      icon: FileText,
      title: "Gestion documentaire",
      description: "Attachez factures, bons de livraison et documents à vos transactions.",
      details: ["Upload de fichiers", "Stockage cloud", "Recherche de documents", "Archivage automatique"]
    },
    {
      icon: Smartphone,
      title: "Interface responsive",
      description: "Accédez à votre inventaire depuis n'importe quel appareil, partout.",
      details: ["Design adaptatif", "Application mobile", "Mode hors-ligne", "Synchronisation auto"]
    },
    {
      icon: Cloud,
      title: "Cloud & API",
      description: "Données sécurisées dans le cloud avec API REST complète pour intégrations.",
      details: ["API REST documentée", "Webhooks", "Intégrations tierces", "99.9% uptime"]
    },
    {
      icon: Lock,
      title: "Multi-tenant sécurisé",
      description: "Isolation complète des données par organisation avec sécurité maximale.",
      details: ["Données isolées", "Domaines personnalisés", "Branding custom", "Conformité SOC2"]
    },
    {
      icon: Zap,
      title: "Performance optimale",
      description: "Interface ultra-rapide avec cache intelligent et optimisations avancées.",
      details: ["Temps de réponse <100ms", "Cache Redis", "CDN global", "Optimisation continue"]
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
              Fonctionnalités complètes
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tout ce dont vous avez besoin pour gérer efficacement votre inventaire, 
              optimiser vos opérations et développer votre activité.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <Icon className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.details.map((detail, i) => (
                        <li key={i} className="text-sm flex items-center">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-16">
            <Link href="/register">
              <Button size="lg">Essayer gratuitement</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
