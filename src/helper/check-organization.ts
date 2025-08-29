import { NextRequest } from "next/server";

// Vérifie que l'organisation paramétrée correspond au cookie selected-org-id
export function checkOrganization(req: NextRequest, organizationId: string) {
  const cookieOrgId = req.cookies.get("selected-org-id")?.value;
  if (!cookieOrgId || cookieOrgId !== organizationId) {
    throw new Error("Organisation non autorisée ou non sélectionnée");
  }
}
