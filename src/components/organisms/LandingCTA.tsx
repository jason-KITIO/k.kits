"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

export function LandingCTA() {
  const { user } = useAuth();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="py-24 md:py-32 px-4 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 animate-fade-in-up tracking-tight">
          Prêt à optimiser votre inventaire ?
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto animate-fade-in-up animation-delay-200 leading-relaxed">
          Rejoignez des centaines d&apos;organisations qui font confiance à K.Kits pour gérer leur stock.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
          {mounted && user ? (
            <Link href="/preferences">
              <Button size="lg" className="transition-all duration-300 hover:scale-105 hover:shadow-xl glow group">
                Accéder au Dashboard
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          ) : (
            <Link href="/register">
              <Button size="lg" className="transition-all duration-300 hover:scale-105 hover:shadow-xl glow group">
                Commencer maintenant
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          )}
          <Link href="/feedback">
            <Button variant="outline" size="lg" className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Nous contacter
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
