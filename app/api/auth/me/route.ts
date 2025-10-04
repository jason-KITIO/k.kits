import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { updateUserProfileSchema } from "@/schema/user-settings.schema";

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Récupération du profil utilisateur connecté
 *     description: Retourne les informations de l'utilisateur actuellement connecté basé sur le token de session
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "clx1234567890"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "user@example.com"
 *                     username:
 *                       type: string
 *                       example: "johndoe"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     phone:
 *                       type: string
 *                       example: "++237 698 765 432"
 *                     profileImageUrl:
 *                       type: string
 *                       example: "https://example.com/avatar.jpg"
 *                     emailVerified:
 *                       type: boolean
 *                       example: true
 *                     phoneVerified:
 *                       type: boolean
 *                       example: false
 *                     twoFactorEnabled:
 *                       type: boolean
 *                       example: false
 *                     banned:
 *                       type: boolean
 *                       example: false
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     lastSignInAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Non authentifié ou session invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Non authentifié"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur serveur"
 */
export async function GET(request: NextRequest) {
  try {
    const cookie = request.headers.get("cookie") || "";
    // Extraire le token de session depuis le cookie 'session_token'
    const match = cookie.match(/session_token=([^;]+)/);
    if (!match) {
      return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
    }
    const sessionToken = match[1];

    // Recherche de la session active
    const session = await prisma.userSession.findFirst({
      where: {
        sessionToken,
        active: true,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          include: {
            organizationMembers: {
              where: { active: true },
              include: {
                organization: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                role: {
                  select: {
                    id: true,
                    name: true,
                    rolePermissions: {
                      where: { active: true },
                      select: {
                        permission: {
                          select: {
                            id: true,
                            name: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Session invalide ou expirée" },
        { status: 401 }
      );
    }

    const user = session.user;
    // console.log("🔍 API /auth/me - User from session:", JSON.stringify(user, null, 2));
    // console.log("🔍 API /auth/me - Organization members:", JSON.stringify(user.organizationMembers, null, 2));

    // Ne pas retourner le mot de passe ou tokens sensibles
    const userSafe = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      profileImageUrl: user.profileImageUrl,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      twoFactorEnabled: user.twoFactorEnabled,
      banned: user.banned,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastSignInAt: user.lastSignInAt,
      organizationMembers: user.organizationMembers?.map(member => ({
        id: member.id,
        organizationId: member.organizationId,
        roleId: member.roleId,
        active: member.active,
        organization: member.organization,
        role: {
          id: member.role.id,
          name: member.role.name,
          permissions: member.role.rolePermissions?.map(rp => rp.permission.name) || []
        }
      })) || [],
    };

    return NextResponse.json({ user: userSafe });
  } catch {
    console.error("Erreur /api/auth/me");
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

// PUT - Mettre à jour le profil utilisateur
export async function PUT(request: NextRequest) {
  try {
    const cookie = request.headers.get("cookie") || "";
    const match = cookie.match(/session_token=([^;]+)/);
    if (!match) {
      return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
    }
    const sessionToken = match[1];

    const session = await prisma.userSession.findFirst({
      where: {
        sessionToken,
        active: true,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!session || !session.user) {
      return NextResponse.json({ message: "Session invalide" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = updateUserProfileSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Données invalides", errors: parsed.error.issues },
        { status: 400 }
      );
    }
    
    const { settings, ...profileData } = parsed.data;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...profileData,
        settings: settings || session.user.settings || {},
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        profileImageUrl: true,
        settings: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Erreur PUT /api/auth/me", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
