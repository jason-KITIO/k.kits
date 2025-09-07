import { useQuery } from "@tanstack/react-query";
import { fetchUserOrganizations, getOrganizationById } from "@/services/organization-service";

export const useOrganizations = () => {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: async () => await fetchUserOrganizations(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useOrganization = (id: string) => {
  return useQuery({
    queryKey: ["organization", id],
    queryFn: async () => await getOrganizationById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};
