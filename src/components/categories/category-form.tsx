"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { categoryCreateSchema, type categoryCreateInput } from "@/schema/category.schema";

interface CategoryFormProps {
  onSubmit: (data: categoryCreateInput) => void;
  defaultValues?: Partial<categoryCreateInput>;
  isLoading?: boolean;
}

export function CategoryForm({ onSubmit, defaultValues, isLoading }: CategoryFormProps) {
  const form = useForm<categoryCreateInput>({
    resolver: zodResolver(categoryCreateSchema),
    defaultValues: {
      name: "",
      description: "",
      active: true,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom *</Label>
        <Input
          id="name"
          {...form.register("name")}
          placeholder="Nom de la catégorie"
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-600 mt-1">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...form.register("description")}
          placeholder="Description de la catégorie"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={form.watch("active")}
          onCheckedChange={(checked) => form.setValue("active", checked)}
        />
        <Label htmlFor="active">Catégorie active</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}