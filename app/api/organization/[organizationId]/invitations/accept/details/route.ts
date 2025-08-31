import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json({ message: "Token manquant" }, { status: 400 });
    }

    const invitation = await prisma.invitation.findUnique({
      where: { token },
      select: { email: true },
    });

    if (!invitation) {
      return NextResponse.json(
        { message: "Invitation non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({ email: invitation.email });
  } catch {
    console.error("Erreur serveur API invitation details:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
