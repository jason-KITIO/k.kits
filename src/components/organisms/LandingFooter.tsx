"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

export function LandingFooter() {
  const { theme } = useTheme();

  return (
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
              La solution complète pour la gestion d&apos;inventaire et de stock.
            </p>
          </div>
          <div className="animate-fade-in-up animation-delay-200">
            <h4 className="font-semibold mb-4">Produit</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/api-docs" className="hover:text-primary transition-colors duration-300">
                  Documentation API
                </Link>
              </li>
            </ul>
          </div>
          <div className="animate-fade-in-up animation-delay-400">
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/feedback" className="hover:text-primary transition-colors duration-300">
                  Nous contacter
                </Link>
              </li>
            </ul>
          </div>
          <div className="animate-fade-in-up animation-delay-600">
            <h4 className="font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/legal/privacy" className="hover:text-primary transition-colors duration-300">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="hover:text-primary transition-colors duration-300">
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
  );
}
