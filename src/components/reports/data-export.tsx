"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useExportData } from "@/hooks/use-reports";
import { useWarehouses } from "@/hooks/use-warehouses";
import { toast } from "sonner";
import { Download, FileText, FileSpreadsheet, File } from "lucide-react";

interface DataExportProps {
  organizationId: string;
}

export function DataExport({ organizationId }: DataExportProps) {
  const [exportConfig, setExportConfig] = useState({
    type: "STOCK" as "STOCK" | "MOVEMENTS" | "PERFORMANCE",
    format: "CSV" as "CSV" | "EXCEL" | "PDF",
    dateFrom: "",
    dateTo: "",
    warehouseId: "",
  });

  const { data: warehouses = [] } = useWarehouses(organizationId);
  const exportMutation = useExportData(organizationId);

  const handleExport = async () => {
    try {
      const blob = await exportMutation.mutateAsync(exportConfig);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const extension = exportConfig.format.toLowerCase();
      const filename = `${exportConfig.type.toLowerCase()}_export.${extension}`;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Export réussi");
    } catch {
      toast.error("Erreur lors de l&apos;export");
    }
  };

  const getFormatIcon = (format: string) => {
    const icons = {
      CSV: FileText,
      EXCEL: FileSpreadsheet,
      PDF: File,
    };
    return icons[format as keyof typeof icons] || FileText;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Export des données</h2>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Configuration de l&apos;export</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type de données</Label>
              <Select
                value={exportConfig.type}
                onValueChange={(value: "STOCK" | "MOVEMENTS" | "PERFORMANCE") =>
                  setExportConfig({ ...exportConfig, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STOCK">Rapport de stock</SelectItem>
                  <SelectItem value="MOVEMENTS">Mouvements de stock</SelectItem>
                  <SelectItem value="PERFORMANCE">
                    Rapport de performance
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="format">Format d&apos;export</Label>
              <Select
                value={exportConfig.format}
                onValueChange={(value: "CSV" | "EXCEL" | "PDF") =>
                  setExportConfig({ ...exportConfig, format: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CSV">CSV</SelectItem>
                  <SelectItem value="EXCEL">Excel</SelectItem>
                  <SelectItem value="PDF">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {exportConfig.type === "MOVEMENTS" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateFrom">Date de début</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={exportConfig.dateFrom}
                  onChange={(e) =>
                    setExportConfig({
                      ...exportConfig,
                      dateFrom: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="dateTo">Date de fin</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={exportConfig.dateTo}
                  onChange={(e) =>
                    setExportConfig({ ...exportConfig, dateTo: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {exportConfig.type === "STOCK" && (
            <div>
              <Label htmlFor="warehouseId">Entrepôt (optionnel)</Label>
              <Select
                value={exportConfig.warehouseId}
                onValueChange={(value) =>
                  setExportConfig({ ...exportConfig, warehouseId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les entrepôts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les entrepôts</SelectItem>
                  {warehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            onClick={handleExport}
            disabled={exportMutation.isPending}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            {exportMutation.isPending
              ? "Export en cours..."
              : "Exporter les données"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Formats disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["CSV", "EXCEL", "PDF"].map((format) => {
              const FormatIcon = getFormatIcon(format);
              return (
                <div
                  key={format}
                  className="flex items-center space-x-3 p-3 border rounded"
                >
                  <FormatIcon className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{format}</div>
                    <div className="text-sm text-muted-foreground">
                      {format === "CSV" && "Fichier texte séparé par virgules"}
                      {format === "EXCEL" && "Classeur Microsoft Excel"}
                      {format === "PDF" && "Document PDF"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
