import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store as StoreType } from "@/types/store";

export function StoresStats({ stores }: { stores: StoreType[] }) {
  const activeStores = stores.filter(s => s.active).length;
  const physicalStores = stores.filter(s => s.type === "PHYSICAL").length;
  const onlineStores = stores.filter(s => s.type === "ONLINE").length;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total boutiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stores.length}</div>
          <p className="text-xs text-muted-foreground">Points de vente</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Actives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{activeStores}</div>
          <p className="text-xs text-muted-foreground">En fonctionnement</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Physiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{physicalStores}</div>
          <p className="text-xs text-muted-foreground">Magasins physiques</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">En ligne</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{onlineStores}</div>
          <p className="text-xs text-muted-foreground">Boutiques digitales</p>
        </CardContent>
      </Card>
    </div>
  );
}
