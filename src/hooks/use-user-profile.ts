import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user-service";
import type { UpdateUserProfile } from "@/schema/user-settings.schema";

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: () => userService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateUserProfile) => userService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
};