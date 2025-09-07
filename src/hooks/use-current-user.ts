import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "@/services/current-user-service";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => await fetchCurrentUser(),
    staleTime: 5 * 60 * 1000,
  });
};
