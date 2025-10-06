import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Plus } from "lucide-react";

export function StockTransfersEmptyState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5" />
          Historique des transferts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <ArrowRightLeft className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucun transfert</h3>
          <p className="text-muted-foreground mb-4">
            Aucun transfert de stock n'a été effectué pour cette boutique.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Créer un transfert
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
