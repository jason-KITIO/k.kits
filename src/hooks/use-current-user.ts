import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "@/services/current-user-service";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["me"],
    queryFn: fetchCurrentUser,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
