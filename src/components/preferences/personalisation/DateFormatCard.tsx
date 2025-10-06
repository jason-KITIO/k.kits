"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";

interface DateFormatCardProps {
  value: string;
  onChange: (value: string) => void;
}

export function DateFormatCard({ value, onChange }: DateFormatCardProps) {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          Format de date
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">Choisissez comment les dates sont affichées dans l'application.</p>
        <div className="space-y-2">
          <Label htmlFor="date-select">Format de date</Label>
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dd/mm/yyyy">DD/MM/YYYY (15/01/2024)</SelectItem>
              <SelectItem value="mm/dd/yyyy">MM/DD/YYYY (01/15/2024)</SelectItem>
              <SelectItem value="yyyy-mm-dd">YYYY-MM-DD (2024-01-15)</SelectItem>
              <SelectItem value="dd-mm-yyyy">DD-MM-YYYY (15-01-2024)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
