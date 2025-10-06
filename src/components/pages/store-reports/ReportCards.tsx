import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, ShoppingCart, Package, TrendingUp, FileText } from "lucide-react";

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

interface ReportCardsProps {
  onCardClick: () => void;
}

export function ReportCards({ onCardClick }: ReportCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {reports.map((report) => (
        <Card key={report.title} className="hover:shadow-md transition-shadow cursor-pointer" onClick={onCardClick}>
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
  );
}
