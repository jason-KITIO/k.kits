import { NextResponse } from "next/server";

export function handleApiError(error: unknown, context?: string) {
  console.error(`API Error${context ? ` in ${context}` : ""}:`, error);

  if (error && typeof error === 'object' && 'code' in error && error.code === "P2002") {
    return NextResponse.json(
      { message: "Cette ressource existe déjà" },
      { status: 400 }
    );
  }

  if (error && typeof error === 'object' && 'code' in error && error.code === "P2025") {
    return NextResponse.json(
      { message: "Ressource introuvable" },
      { status: 404 }
    );
  }

  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string' && error.message.includes("Unauthorized")) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string' && error.message.includes("Forbidden")) {
    return NextResponse.json({ message: "Accès interdit" }, { status: 403 });
  }

  return NextResponse.json(
    { message: "Erreur interne du serveur" },
    { status: 500 }
  );
}

export function redirectToError(status: number) {
  const errorPages = {
    400: "/error/400",
    401: "/error/401",
    403: "/error/403",
    404: "/not-found",
    500: "/error/500",
    503: "/error/503",
  };

  return errorPages[status as keyof typeof errorPages] || "/error/500";
}
