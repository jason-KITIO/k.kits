"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Control } from "react-hook-form";

interface ProductFormPricingProps {
  control: Control<any>;
}

export function ProductFormPricing({ control }: ProductFormPricingProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prix et coûts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField control={control} name="unitPrice" render={({ field }) => (
            <FormItem>
              <FormLabel>Prix de vente (FCFA) *</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={control} name="costPrice" render={({ field }) => (
            <FormItem>
              <FormLabel>Prix d'achat (FCFA) *</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
      </CardContent>
    </Card>
  );
}
