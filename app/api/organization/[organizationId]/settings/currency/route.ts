import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  try {
    return NextResponse.json({
      currency: "XAF"
    });
  } catch (error) {
    console.error("Erreur GET currency:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}