"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft, RefreshCw, LogIn } from "lucide-react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface ErrorLayoutProps {
  code: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  showLogin?: boolean;
  showRefresh?: boolean;
}

export function ErrorLayout({ code, title, description, icon: Icon, iconColor, showLogin, showRefresh }: ErrorLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className={`mx-auto w-12 h-12 ${iconColor} rounded-full flex items-center justify-center mb-4`}>
            <Icon className={`h-6 w-6 ${iconColor.replace('bg-', 'text-').replace('-100', '-600')}`} />
          </div>
          <CardTitle>{title} ({code})</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {showRefresh ? (
              <Button onClick={() => window.location.reload()} variant="outline" className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                {code === "503" ? "Réessayer" : "Recharger"}
              </Button>
            ) : (
              <Button onClick={() => window.history.back()} variant="outline" className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            )}
            {showLogin ? (
              <Button asChild className="flex-1">
                <Link href="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Se connecter
                </Link>
              </Button>
            ) : (
              <Button asChild className="flex-1">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Accueil
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
