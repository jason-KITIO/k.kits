import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes publiques qui ne nécessitent pas d'authentification
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/api/auth",
    "/api/invitations/validate",
    "/api/invitations/accept",
    "/legal",
    "/support",
    "/api-docs"
  ];

  // Routes d'erreur
  const errorRoutes = ["/error"];

  // Routes protégées qui nécessitent une authentification
  const protectedRoutes = ["/preferences"];

  // Vérifier si la route est publique
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Vérifier si c'est une route d'erreur
  const isErrorRoute = errorRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Récupérer les cookies d'authentification
  const sessionToken = request.cookies.get("session_token")?.value;
  const selectedOrgId = request.cookies.get("selected-org-id")?.value;

  // Si route publique ou d'erreur, laisser passer
  if (isPublicRoute || isErrorRoute) {
    return NextResponse.next();
  }

  // Si pas de session sur n'importe quelle route non-publique, rediriger vers login
  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si utilisateur connecté mais pas d'organisation sélectionnée pour les routes d'organisation
  if (sessionToken && !selectedOrgId && pathname.startsWith("/preferences/organizations/")) {
    // Rediriger vers page de sélection d'organisation
    return NextResponse.redirect(new URL("/preferences", request.url));
  }

  // Si utilisateur connecté mais pas d'organisation sélectionnée pour le dashboard
  if (sessionToken && !selectedOrgId && pathname.startsWith("/preferences")) {
    // Rediriger vers page de sélection d'organisation
    return NextResponse.redirect(new URL("/preferences", request.url));
  }

  // Si utilisateur connecté accède aux pages d'auth, rediriger vers preferences
  if (sessionToken && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/preferences", request.url));
  }

  // Gestion des invitations - rediriger vers register avec token
  if (pathname === "/invite" || pathname.startsWith("/invite/")) {
    const token =
      pathname.split("/invite/")[1] ||
      request.nextUrl.searchParams.get("token");
    if (token) {
      const registerUrl = new URL("/register", request.url);
      registerUrl.searchParams.set("token", token);
      return NextResponse.redirect(registerUrl);
    }
  }

  // Vérification spéciale pour les routes d'organisation spécifiques
  const orgRouteMatch = pathname.match(/\/preferences\/organizations\/([^\/]+)\/(.+)/);
  if (orgRouteMatch) {
    const [, orgId, subPath] = orgRouteMatch;
    
    // Vérifier que l'organisation dans l'URL correspond à celle sélectionnée
    if (selectedOrgId && selectedOrgId !== orgId) {
      // Rediriger vers la même page mais avec la bonne organisation
      const correctUrl = new URL(`/preferences/organizations/${selectedOrgId}/${subPath}`, request.url);
      return NextResponse.redirect(correctUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) - handled separately
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
