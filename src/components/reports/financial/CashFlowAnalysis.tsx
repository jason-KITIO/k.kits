"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CashFlow {
  operating: number;
  investing: number;
  financing: number;
  net: number;
}

interface CashFlowAnalysisProps {
  cashFlow: CashFlow;
}

export function CashFlowAnalysis({ cashFlow }: CashFlowAnalysisProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse des Flux de Trésorerie</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Flux Opérationnel</p>
            <p className={`text-2xl font-bold ${cashFlow.operating >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {cashFlow.operating.toLocaleString()} €
            </p>
            <p className="text-xs text-muted-foreground">Activités principales</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Flux d'Investissement</p>
            <p className={`text-2xl font-bold ${cashFlow.investing >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {cashFlow.investing.toLocaleString()} €
            </p>
            <p className="text-xs text-muted-foreground">Investissements</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Flux de Financement</p>
            <p className={`text-2xl font-bold ${cashFlow.financing >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {cashFlow.financing.toLocaleString()} €
            </p>
            <p className="text-xs text-muted-foreground">Financement</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Flux Net</p>
            <p className={`text-2xl font-bold ${cashFlow.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {cashFlow.net.toLocaleString()} €
            </p>
            <p className="text-xs text-muted-foreground">Variation totale</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
