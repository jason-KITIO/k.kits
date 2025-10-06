"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useAuth } from "@/providers/auth-provider";
import { useLogout } from "@/hooks/use-logout";
import { useTheme } from "next-themes";

export function LandingHeader() {
  const { user, isLoading } = useAuth();
  const logout = useLogout();
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
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
          <Badge variant="secondary" className="text-xs">BETA</Badge>
        </div>
        <nav className="hidden md:flex items-center space-x-6 animate-fade-in"></nav>
        <div className="flex items-center space-x-4 animate-fade-in-right">
          <ThemeSwitcher />
          {mounted && !isLoading && (user ? (
            <>
              <Link href="/preferences">
                <Button variant="ghost" className="transition-all duration-300 hover:scale-105">
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
            <>
              <Link href="/login">
                <Button variant="ghost" className="transition-all duration-300 hover:scale-105">
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
  );
}
