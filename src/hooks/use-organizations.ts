import { useQuery } from "@tanstack/react-query";
import {
  fetchUserOrganizations,
  getOrganizationById,
} from "@/services/organization-service";
import { Organization } from "@prisma/client";

export function useOrganizations() {
  return useQuery<Organization[], Error>({
    queryKey: ["organizations"],
    queryFn: fetchUserOrganizations,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
export function useOrganization(id: string) {
  return useQuery<Organization, Error>({
    queryKey: ["organization", id],
    queryFn: () => getOrganizationById(id),
    enabled: !!id, // Ne lancer la requête que si id est défini
    staleTime: 5 * 60 * 1000, // 5 minutes, optionnel
  });
}
