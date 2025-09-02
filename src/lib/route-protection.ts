import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "./auth-middleware";

// Wrapper pour protéger une route avec une permission
export function withPermission(permission: string) {
  return function (handler: Function) {
    return async function (
      req: NextRequest,
      context: { params: Promise<{ organizationId: string }> }
    ) {
      const { organizationId } = await context.params;
      
      // Vérifier la permission
      const authResult = await checkPermission(req, organizationId, permission);
      
      if (!authResult.success) {
        return NextResponse.json(
          { error: authResult.message },
          { status: authResult.status }
        );
      }

      // Ajouter les infos utilisateur au contexte
      const enhancedContext = {
        ...context,
        user: authResult.user,
        permissions: authResult.permissions
      };

      // Exécuter le handler original
      return handler(req, enhancedContext);
    };
  };
}