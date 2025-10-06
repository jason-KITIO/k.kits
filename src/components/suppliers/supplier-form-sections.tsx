"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Control } from "react-hook-form";

export function SupplierFormGeneral({ control }: { control: Control<any> }) {
  return (
    <Card>
      <CardHeader><CardTitle>Informations générales</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField control={control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Nom *</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField control={control} name="phone" render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={control} name="website" render={({ field }) => (
            <FormItem>
              <FormLabel>Site web</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <FormField control={control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl><Textarea {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </CardContent>
    </Card>
  );
}

export function SupplierFormAddress({ control }: { control: Control<any> }) {
  return (
    <Card>
      <CardHeader><CardTitle>Adresse</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <FormField control={control} name="address" render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="grid gap-4 md:grid-cols-3">
          <FormField control={control} name="city" render={({ field }) => (
            <FormItem>
              <FormLabel>Ville</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={control} name="postalCode" render={({ field }) => (
            <FormItem>
              <FormLabel>Code postal</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={control} name="country" render={({ field }) => (
            <FormItem>
              <FormLabel>Pays</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
      </CardContent>
    </Card>
  );
}
