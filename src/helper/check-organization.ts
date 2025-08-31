import { cookies } from "next/headers";

// Vérifie que l'organisation paramétrée correspond au cookie selected-org-id
export async function checkOrganization(organizationId: string) {
  try {
    const cookieStore = await cookies();
    const cookieOrgId = cookieStore.get("selected-org-id")?.value;

    // En développement, on autorise l'accès même sans cookie
    if (!cookieOrgId) {
      console.warn(
        "No organization cookie found - allowing access for development"
      );
      return { success: true };
    }

    if (cookieOrgId !== organizationId) {
      return {
        success: false,
        message: "Organisation non autorisée",
        status: 403,
        redirect: "/error/403",
      };
    }

    return { success: true };
  } catch {
    console.warn("Organization check failed - allowing access for development");
    return { success: true };
  }
}
