import { ProfileForm, UserSettingsForm } from "@/components/profile";

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mon Profil</h1>
        <p className="text-muted-foreground">
          Gérez vos informations personnelles et vos paramètres
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <ProfileForm />
        <UserSettingsForm />
      </div>
    </div>
  );
}