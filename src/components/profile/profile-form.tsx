"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserProfile, useUpdateUserProfile } from "@/hooks/use-user-profile";
import {
  updateUserProfileSchema,
  type UpdateUserProfile,
} from "@/schema/user-settings.schema";
import { useEffect } from "react";
import { toast } from "sonner";
import { ImageUpload } from "./image-upload";

export function ProfileForm() {
  const { data: user, isLoading } = useUserProfile();
  const updateProfile = useUpdateUserProfile();

  const form = useForm<UpdateUserProfile>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phone: "",
      profileImageUrl: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        profileImageUrl: user.profileImageUrl || "",
      });
    }
  }, [user, form]);

  const onSubmit = async (data: UpdateUserProfile) => {
    try {
      await updateProfile.mutateAsync(data);
      toast.success("Profil mis à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil");
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations personnelles</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                {...form.register("firstName")}
                placeholder="Votre prénom"
              />
              {form.formState.errors.firstName && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                {...form.register("lastName")}
                placeholder="Votre nom"
              />
              {form.formState.errors.lastName && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...form.register("email")}
              placeholder="votre@email.com"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="username">Nom d'utilisateur</Label>
            <Input
              id="username"
              {...form.register("username")}
              placeholder="votre_nom_utilisateur"
            />
            {form.formState.errors.username && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              {...form.register("phone")}
              placeholder="+237 6XX XXX XXX"
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <Label>Photo de profil</Label>
            <ImageUpload
              currentImage={form.watch("profileImageUrl")}
              onImageChange={(url) => form.setValue("profileImageUrl", url)}
              disabled={updateProfile.isPending}
            />
            {form.formState.errors.profileImageUrl && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.profileImageUrl.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={updateProfile.isPending}
            className="w-full"
          >
            {updateProfile.isPending ? "Mise à jour..." : "Mettre à jour"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
