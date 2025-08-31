"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useMovementReport } from "@/hooks/use-reports";
import { ArrowUp, ArrowDown, ArrowRightLeft, Settings } from "lucide-react";

interface MovementsReportProps {
  organizationId: string;
}

export function MovementsReport({ organizationId }: MovementsReportProps) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data: movements = [], isLoading } = useMovementReport(
    organizationId,
    dateFrom,
    dateTo
  );

  const getMovementIcon = (type: string) => {
    const icons = {
      IN: ArrowUp,
      OUT: ArrowDown,
      TRANSFER: ArrowRightLeft,
      ADJUSTMENT: Settings,
    };
    return icons[type as keyof typeof icons] || ArrowRightLeft;
  };

  const getMovementColor = (type: string) => {
    const colors = {
      IN: "text-green-600",
      OUT: "text-red-600",
      TRANSFER: "text-blue-600",
      ADJUSTMENT: "text-orange-600",
    };
    return colors[type as keyof typeof colors] || "text-gray-600";
  };

  const getMovementText = (type: string) => {
    const texts = {
      IN: "Entrée",
      OUT: "Sortie",
      TRANSFER: "Transfert",
      ADJUSTMENT: "Ajustement",
    };
    return texts[type as keyof typeof texts] || type;
  };

  const totalMovements = movements.length;
  const entriesCount = movements.filter((m) => m.movementType === "IN").length;
  const exitsCount = movements.filter((m) => m.movementType === "OUT").length;
  const transfersCount = movements.filter(
    (m) => m.movementType === "TRANSFER"
  ).length;

  if (isLoading) return <div>Chargement du rapport...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Rapport des mouvements</h2>

      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateFrom">Date de début</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dateTo">Date de fin</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total mouvements
            </CardTitle>
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMovements}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entrées</CardTitle>
            <ArrowUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {entriesCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sorties</CardTitle>
            <ArrowDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{exitsCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transferts</CardTitle>
            <ArrowRightLeft className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {transfersCount}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des mouvements</CardTitle>
        </CardHeader>
        <CardContent>
          {movements.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucun mouvement trouvé
            </p>
          ) : (
            <div className="space-y-2">
              {movements.map((movement) => {
                const MovementIcon = getMovementIcon(movement.movementType);
                const color = getMovementColor(movement.movementType);

                return (
                  <div
                    key={movement.id}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div className="flex items-center space-x-4">
                      <MovementIcon className={`h-5 w-5 ${color}`} />
                      <div>
                        <span className="font-medium">
                          {movement.productName}
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({movement.sku})
                        </span>
                        {movement.warehouseName && (
                          <span className="text-sm text-muted-foreground ml-2">
                            - {movement.warehouseName}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                      <div>
                        <span className="font-medium">Qté:</span>{" "}
                        {movement.quantity}
                      </div>
                      <div>
                        <span className="font-medium">Stock:</span>{" "}
                        {movement.previousQty} → {movement.newQty}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span>{" "}
                        {new Date(movement.performedAt).toLocaleDateString()}
                      </div>
                      <Badge variant="secondary">
                        {getMovementText(movement.movementType)}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
