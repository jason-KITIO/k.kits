"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BarChart3, Download, FileText, TrendingUp, Package, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { ReportDashboard } from "@/components/reports/report-dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StoreReportsPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const storeId = params.storeId as string;
  const [activeTab, setActiveTab] = useState("overview");

  const reports = [
    {
      title: "Rapport de ventes",
      description: "Analyse des ventes par période",
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-100",
      type: "sales"
    },
    {
      title: "Rapport de stock",
      description: "État et mouvements de stock",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      type: "stock"
    },
    {
      title: "Rapport financier",
      description: "Chiffre d'affaires et bénéfices",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      type: "profit"
    },
    {
      title: "Rapport clients",
      description: "Analyse de la clientèle",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      type: "customers"
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/preferences/organizations/${organizationId}/stores/${storeId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Rapports de la boutique</h1>
          <p className="text-muted-foreground">
            Analysez les performances de votre boutique
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="detailed">Rapports détaillés</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {reports.map((report) => (
              <Card key={report.title} className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setActiveTab("detailed")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${report.bgColor}`}>
                      <report.icon className={`h-5 w-5 ${report.color}`} />
                    </div>
                    {report.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{report.description}</p>
                  <div className="flex gap-2">
                    <Button size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Voir le rapport
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Exporter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rapports personnalisés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Créez vos rapports</h3>
                <p className="text-muted-foreground mb-4">
                  Générez des rapports personnalisés selon vos besoins spécifiques.
                </p>
                <Button onClick={() => setActiveTab("detailed")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Accéder aux rapports détaillés
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed">
          <ReportDashboard organizationId={organizationId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}