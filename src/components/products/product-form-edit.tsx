"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Control } from "react-hook-form";

interface ProductFormEditProps {
  control: Control<any>;
}

export function ProductFormEdit({ control }: ProductFormEditProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Caractéristiques</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <FormField control={control} name="weight" render={({ field }) => (
            <FormItem>
              <FormLabel>Poids (kg)</FormLabel>
              <FormControl>
                <Input type="number" step="0.001" min="0" value={field.value || ""} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={control} name="dimensions" render={({ field }) => (
            <FormItem>
              <FormLabel>Dimensions</FormLabel>
              <FormControl><Input placeholder="L x l x H (cm)" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={control} name="minStock" render={({ field }) => (
            <FormItem>
              <FormLabel>Stock minimum</FormLabel>
              <FormControl>
                <Input type="number" min="0" value={field.value || ""} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
      </CardContent>
    </Card>
  );
}
