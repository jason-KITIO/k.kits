import { NextRequest, NextResponse } from "next/server";
import { PERMISSIONS } from "@/lib/permissions";
import { checkUserPermission } from "@/lib/api-permissions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  try {
    const { organizationId } = await params;
    
    // Vérifier l'authentification
    const cookie = request.headers.get("cookie") || "";
    const match = cookie.match(/session_token=([^;]+)/);
    if (!match) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const sessionToken = match[1];
    const { hasAccess, user, membership } = await checkUserPermission(
      sessionToken,
      organizationId,
      PERMISSIONS.DASHBOARD_READ
    );

    if (!hasAccess) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // Retourner les données du dashboard
    const permissions = membership.role.rolePermissions.map((rp: any) => rp.permission.name);
    
    return NextResponse.json({
      overview: {
        totalProducts: 0,
        totalStores: 0,
        totalWarehouses: 0,
        lowStockProducts: 0
      },
      sales: {
        todayAmount: 0,
        todayCount: 0
      },
      stock: {
        totalValue: 0
      },
      recentActivity: []
    });

  } catch (error) {
    console.error("Erreur dashboard API:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}