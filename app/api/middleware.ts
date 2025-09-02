import { NextRequest, NextResponse, NextFetchEvent } from "next/server";
import { verify } from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

// Mapping simplifié des ressources aux permissions nécessaires (exemple, à adapter)
const routePermissionMap: {
  [resource: string]: {
    [method: string]: string;
  };
} = {
  stores: {
    GET: "store.read",
    POST: "store.create",
    PUT: "store.update",
    DELETE: "store.delete",
  },
  stocks: {
    GET: "stock.read",
    POST: "stock.create",
  },
  sales: {
    GET: "sale.read",
    POST: "sale.create",
  },
  // Ajouter d'autres ressources si besoin
};

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  try {
    const sessionToken = req.cookies.get("session_token")?.value;
    if (!sessionToken) return unauthorized("Token de session manquant");

    const session = await prisma.userSession.findFirst({
      where: {
        sessionToken,
        active: true,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: true,
      },
    });

    if (!session) return unauthorized("Session invalide ou expirée");

    const userId = session.userId;
    if (!userId) return unauthorized("Payload token invalide");

    const url = new URL(req.url);
    const segments = url.pathname.split("/").filter(Boolean);

    const orgIndex = segments.indexOf("organizations");
    if (orgIndex === -1 || segments.length <= orgIndex + 1) {
      return NextResponse.json(
        { error: "organizationId obligatoire dans l'URL" },
        { status: 400 }
      );
    }
    const organizationId = segments[orgIndex + 1];

    // Extraction optionnelle du storeId
    const storeIndex = segments.indexOf("stores");
    const storeId =
      storeIndex !== -1 && segments.length > storeIndex + 1
        ? segments[storeIndex + 1]
        : null;

    // Construire tableau OR propre sans undefined
    const orFilters = storeId
      ? [{ storeId: null }, { storeId }]
      : [{ storeId: null }];

    // Récupérer userRoles avec inclusion des permissions via role -> rolePermissions -> permission
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId,
        organizationId,
        OR: orFilters,
      },
      include: {
        role: {
          include: {
            rolePermissions: {
              where: { active: true },
              include: { permission: true },
            },
          },
        },
      },
    });

    if (userRoles.length === 0) {
      return NextResponse.json(
        { error: "Aucun rôle assigné pour cette organisation / magasin" },
        { status: 403 }
      );
    }

    // Agréger les permissions
    const permissions = new Set<string>();
    userRoles.forEach((ur) => {
      ur.role.rolePermissions.forEach((rp) => {
        if (rp.permission.active) {
          permissions.add(rp.permission.name);
        }
      });
    });

    // Extraire la ressource ciblée dans le chemin
    const resource = extractResourceFromPath(segments);

    // Vérifier permission requise pour méthode HTTP
    const requiredPermission = resource
      ? routePermissionMap[resource]?.[req.method]
      : null;
    if (requiredPermission && !permissions.has(requiredPermission)) {
      return NextResponse.json(
        { error: "Permission insuffisante pour cette action" },
        { status: 403 }
      );
    }

    // Passer les infos utilisateur + contexte au handler via headers (optionnel)
    const response = NextResponse.next();
    response.headers.set("X-User-Id", userId);
    response.headers.set("X-Organization-Id", organizationId);
    if (storeId) response.headers.set("X-Store-Id", storeId);

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.json(
      { error: "Erreur interne serveur" },
      { status: 500 }
    );
  }
}

function unauthorized(message: string) {
  return NextResponse.json({ error: message }, { status: 401 });
}

function extractResourceFromPath(segments: string[]): string | null {
  const knownResources = [
    "stores",
    "stocks",
    "sales",
    "roles",
    "users",
    "products",
  ];
  for (const seg of segments) {
    if (knownResources.includes(seg)) return seg;
  }
  return null;
}

export const config = {
  matcher: ["/api/v1/:path*"],
};
