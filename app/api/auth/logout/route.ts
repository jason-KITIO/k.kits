import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get("session_token")?.value;

    if (sessionToken) {
      // Désactiver la session dans la base de données
      await prisma.userSession.updateMany({
        where: { sessionToken },
        data: { active: false }
      });
    }

    // Créer la réponse de redirection
    const response = NextResponse.json({ success: true });
    
    // Supprimer tous les cookies d'authentification
    response.cookies.delete("session_token");
    response.cookies.delete("selected-org-id");
    
    return response;
  } catch (error) {
    console.error("Erreur logout:", error);
    return NextResponse.json({ error: "Erreur lors de la déconnexion" }, { status: 500 });
  }
}