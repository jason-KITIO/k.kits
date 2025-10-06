"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, ShoppingCart, Package, TrendingUp } from "lucide-react";
import { ReportDashboard } from "@/components/reports/report-dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoreReportsHeader } from "@/components/pages/store-reports/StoreReportsHeader";
import { ReportCards } from "@/components/pages/store-reports/ReportCards";

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
      <StoreReportsHeader organizationId={organizationId} storeId={storeId} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="detailed">Rapports détaillés</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <ReportCards onCardClick={() => setActiveTab("detailed")} />

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