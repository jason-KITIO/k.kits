"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, UserPlus, Repeat, Crown } from "lucide-react";

interface CustomerKPIsProps {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
}

export function CustomerKPIs({ totalCustomers, newCustomers, returningCustomers }: CustomerKPIsProps) {
  const retentionRate = totalCustomers > 0 ? (returningCustomers / totalCustomers) * 100 : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clients totaux</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCustomers}</div>
          <p className="text-xs text-muted-foreground">Base clients active</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nouveaux clients</CardTitle>
          <UserPlus className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{newCustomers}</div>
          <p className="text-xs text-muted-foreground">Cette période</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clients fidèles</CardTitle>
          <Repeat className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{returningCustomers}</div>
          <p className="text-xs text-muted-foreground">Achats multiples</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taux de fidélité</CardTitle>
          <Crown className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{retentionRate.toFixed(1)}%</div>
          <div className="flex items-center gap-2 mt-1">
            <Progress value={retentionRate} className="flex-1 h-2" />
            <Badge variant={retentionRate >= 50 ? "default" : "secondary"}>
              {retentionRate >= 50 ? "Bon" : "À améliorer"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
