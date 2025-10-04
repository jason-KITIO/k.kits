"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Filter, Download } from "lucide-react";
import type { ReportRequest, ReportType, ReportPeriod } from "@/schema/report.schema";

interface ReportFiltersProps {
  onFiltersChange: (filters: ReportRequest) => void;
  onExport: (format: "csv" | "excel" | "pdf") => void;
  isLoading?: boolean;
}

export function ReportFilters({ onFiltersChange, onExport, isLoading }: ReportFiltersProps) {
  const [filters, setFilters] = useState<ReportRequest>({
    type: "sales",
    period: "this_month",
    format: "json",
    includeDetails: true
  });

  const handleFilterChange = (key: keyof ReportRequest, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const reportTypes: { value: ReportType; label: string }[] = [
    { value: "sales", label: "Ventes" },
    { value: "stock", label: "Stock" },
    { value: "movements", label: "Mouvements" },
    { value: "profit", label: "Rentabilité" },
    { value: "customers", label: "Clients" },
    { value: "products", label: "Produits" },
    { value: "financial", label: "Financier" },
    { value: "performance", label: "Performance" }
  ];

  const periods: { value: ReportPeriod; label: string }[] = [
    { value: "today", label: "Aujourd'hui" },
    { value: "yesterday", label: "Hier" },
    { value: "this_week", label: "Cette semaine" },
    { value: "last_week", label: "Semaine dernière" },
    { value: "this_month", label: "Ce mois" },
    { value: "last_month", label: "Mois dernier" },
    { value: "this_quarter", label: "Ce trimestre" },
    { value: "last_quarter", label: "Trimestre dernier" },
    { value: "this_year", label: "Cette année" },
    { value: "last_year", label: "Année dernière" },
    { value: "custom", label: "Période personnalisée" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtres de rapport
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Type de rapport</Label>
            <Select
              value={filters.type}
              onValueChange={(value: ReportType) => handleFilterChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Période</Label>
            <Select
              value={filters.period}
              onValueChange={(value: ReportPeriod) => handleFilterChange("period", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Grouper par</Label>
            <Select
              value={filters.groupBy || ""}
              onValueChange={(value) => handleFilterChange("groupBy", value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Aucun groupement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Jour</SelectItem>
                <SelectItem value="week">Semaine</SelectItem>
                <SelectItem value="month">Mois</SelectItem>
                <SelectItem value="quarter">Trimestre</SelectItem>
                <SelectItem value="year">Année</SelectItem>
                <SelectItem value="product">Produit</SelectItem>
                <SelectItem value="category">Catégorie</SelectItem>
                <SelectItem value="store">Boutique</SelectItem>
                <SelectItem value="customer">Client</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filters.period === "custom" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de début</Label>
              <Input
                type="datetime-local"
                value={filters.startDate || ""}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Date de fin</Label>
              <Input
                type="datetime-local"
                value={filters.endDate || ""}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExport("csv")}
            disabled={isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExport("excel")}
            disabled={isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExport("pdf")}
            disabled={isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}