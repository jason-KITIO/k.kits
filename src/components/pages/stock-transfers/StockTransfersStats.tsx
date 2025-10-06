import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StockTransfersStats() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Transferts en cours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">0</div>
          <p className="text-xs text-muted-foreground">En attente</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Terminés ce mois</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">0</div>
          <p className="text-xs text-muted-foreground">Transferts réalisés</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Valeur transférée</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">0 FCFA</div>
          <p className="text-xs text-muted-foreground">Ce mois</p>
        </CardContent>
      </Card>
    </div>
  );
}
