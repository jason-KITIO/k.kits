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
  ];

  // Routes protégées qui nécessitent une authentification
  const protectedRoutes = ["/dashboard", "/preferences"];

  // Vérifier si la route est publique
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Vérifier si la route est protégée
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Récupérer les cookies d'authentification
  const sessionToken = request.cookies.get("session_token")?.value;
  const selectedOrgId = request.cookies.get("selected-org-id")?.value;

  // Si route publique, laisser passer
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Si pas de session sur n'importe quelle route non-publique, rediriger vers login
  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si utilisateur connecté mais pas d'organisation sélectionnée
  if (sessionToken && !selectedOrgId && pathname.startsWith("/dashboard")) {
    // Rediriger vers page de sélection d'organisation
    return NextResponse.redirect(new URL("/preferences", request.url));
  }

  // Si utilisateur connecté accède aux pages d'auth, rediriger vers dashboard
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
