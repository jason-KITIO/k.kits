import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateUserProfile } from "@/schema/user-settings.schema";

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  profileImageUrl?: string;
  settings?: {
    notifications?: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    display?: {
      darkMode: boolean;
      language: "fr" | "en" | "es";
      timezone: string;
    };
  };
}

export function useUserProfile() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: async (): Promise<User> => {
      const response = await fetch("/api/auth/me");
      if (!response.ok) throw new Error("Failed to fetch user profile");
      return response.json();
    },
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateUserProfile) => {
      const response = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
}