"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

export function LandingHero() {
  const { user } = useAuth();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
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
          La solution complète pour gérer vos stocks, suivre vos produits et optimiser votre inventaire.
          <span className="font-semibold text-foreground"> Rejoignez 500+ organisations</span> qui nous font confiance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
          {mounted && user ? (
            <Link href="/preferences">
              <Button size="lg" className="w-full sm:w-auto transition-all duration-300 hover:scale-105 hover:shadow-xl glow group">
                Accéder au Dashboard
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto transition-all duration-300 hover:scale-105 hover:shadow-xl glow group">
                  Essai gratuit 14 jours
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/api-docs">
                <Button variant="outline" size="lg" className="w-full sm:w-auto transition-all duration-300 hover:scale-105 hover:shadow-lg animate-shine">
                  Voir la démo
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
