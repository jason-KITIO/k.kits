"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface MovementType {
  type: string;
  count: number;
  quantity: number;
}

interface MovementsByTypeTableProps {
  movements: MovementType[];
  totalMovements: number;
}

const getMovementTypeColor = (type: string) => {
  switch (type.toUpperCase()) {
    case 'IN': return 'bg-green-100 text-green-800';
    case 'OUT': return 'bg-red-100 text-red-800';
    case 'TRANSFER': return 'bg-blue-100 text-blue-800';
    case 'ADJUSTMENT': return 'bg-yellow-100 text-yellow-800';
    case 'SALE': return 'bg-purple-100 text-purple-800';
    case 'PURCHASE': return 'bg-indigo-100 text-indigo-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getMovementTypeLabel = (type: string) => {
  switch (type.toUpperCase()) {
    case 'IN': return 'Entrée';
    case 'OUT': return 'Sortie';
    case 'TRANSFER': return 'Transfert';
    case 'ADJUSTMENT': return 'Ajustement';
    case 'SALE': return 'Vente';
    case 'PURCHASE': return 'Achat';
    default: return type;
  }
};

export function MovementsByTypeTable({ movements, totalMovements }: MovementsByTypeTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mouvements par type</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Nombre</TableHead>
              <TableHead className="text-right">Quantité</TableHead>
              <TableHead className="text-right">% du total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.map((movement) => (
              <TableRow key={movement.type}>
                <TableCell>
                  <Badge className={getMovementTypeColor(movement.type)}>
                    {getMovementTypeLabel(movement.type)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{movement.count}</TableCell>
                <TableCell className="text-right">{movement.quantity}</TableCell>
                <TableCell className="text-right">
                  {totalMovements > 0 ? ((movement.count / totalMovements) * 100).toFixed(1) : 0}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
