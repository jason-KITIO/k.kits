import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SupplierStatsProps {
  total: number;
  active: number;
}

export function SupplierStats({ total, active }: SupplierStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total fournisseurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
          <p className="text-xs text-muted-foreground">Partenaires enregistrés</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Actifs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{active}</div>
          <p className="text-xs text-muted-foreground">Fournisseurs actifs</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Inactifs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-600">{total - active}</div>
          <p className="text-xs text-muted-foreground">Fournisseurs inactifs</p>
        </CardContent>
      </Card>
    </div>
  );
}
