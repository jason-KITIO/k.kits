"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

interface TimeFormatCardProps {
  value: string;
  onChange: (value: string) => void;
}

export function TimeFormatCard({ value, onChange }: TimeFormatCardProps) {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          Format d'heure
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">Définissez le format d'affichage des heures.</p>
        <div className="space-y-2">
          <Label htmlFor="time-select">Format d'heure</Label>
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 heures (14:30)</SelectItem>
              <SelectItem value="12h">12 heures (2:30 PM)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
