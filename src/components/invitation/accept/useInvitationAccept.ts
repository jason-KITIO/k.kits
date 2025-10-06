import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface FormData {
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export function useInvitationAccept(token: string | null, email: string) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsSubmitting(true);
    const username = `${formData.firstName}${formData.lastName}`.toLowerCase();

    try {
      const registerResponse = await fetch("/api/auth/email/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          username,
          emailVerified: true,
        }),
      });

      if (!registerResponse.ok) {
        const error = await registerResponse.json();
        if (registerResponse.status === 409) {
          throw new Error("Un compte existe déjà avec cette adresse email. Veuillez vous connecter.");
        }
        throw new Error(error.error || "Erreur lors de l'inscription");
      }

      const { user } = await registerResponse.json();

      const acceptResponse = await fetch("/api/invitations/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, userId: user.id }),
      });

      if (!acceptResponse.ok) {
        throw new Error("Erreur lors de l'acceptation de l'invitation");
      }

      const { organizationId } = await acceptResponse.json();
      toast.success("Compte créé et invitation acceptée !");
      router.push(`/preferences/organizations/${organizationId}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, handleSubmit };
}
