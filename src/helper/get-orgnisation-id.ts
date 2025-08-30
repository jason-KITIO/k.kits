"use client";

import { useParams } from "next/navigation";

export function useOrganizationIdFromUrl(): string | undefined {
  const params = useParams();
  const id = params?.id;
  return Array.isArray(id) ? id[0] : id;
}
