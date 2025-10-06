import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Package, BarChart3, Users, ArrowRightLeft, AlertTriangle, Shield } from "lucide-react";

const features = [
  {
    icon: Package,
    title: "Gestion de stock intelligente",
    description: "Suivez vos produits en temps réel avec des alertes automatiques de stock bas",
  },
  {
    icon: BarChart3,
    title: "Rapports & Analytics",
    description: "Tableaux de bord détaillés et rapports d'export pour analyser vos performances",
  },
  {
    icon: Users,
    title: "Gestion d'équipe",
    description: "Rôles et permissions granulaires pour votre organisation",
  },
  {
    icon: ArrowRightLeft,
    title: "Transferts & Mouvements",
    description: "Gérez facilement les transferts entre entrepôts et suivez tous les mouvements",
  },
  {
    icon: AlertTriangle,
    title: "Alertes intelligentes",
    description: "Notifications automatiques pour ruptures de stock et seuils critiques",
  },
  {
    icon: Shield,
    title: "Sécurisé & Fiable",
    description: "Authentification multi-facteurs et sauvegarde automatique de vos données",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 md:py-32 px-4">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-20">
          <Badge variant="outline" className="mb-4">Fonctionnalités</Badge>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Une suite complète d'outils pour gérer efficacement votre inventaire et optimiser vos opérations.
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
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
