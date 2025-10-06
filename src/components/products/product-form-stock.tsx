"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Control } from "react-hook-form";

interface ProductFormStockProps {
  control: Control<any>;
}

export function ProductFormStock({ control }: ProductFormStockProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock initial</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField control={control} name="initialStock" render={({ field }) => (
          <FormItem>
            <FormLabel>Quantité initiale</FormLabel>
            <FormControl>
              <Input type="number" min="0" placeholder="0" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </CardContent>
    </Card>
  );
}
