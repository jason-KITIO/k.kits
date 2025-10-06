import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

interface LegalLayoutProps {
  title: string;
  lastUpdate: string;
  children: ReactNode;
}

export function LegalLayout({ title, lastUpdate, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-primary hover:underline mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à l'accueil
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{title}</CardTitle>
            <p className="text-muted-foreground">Dernière mise à jour : {lastUpdate}</p>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
