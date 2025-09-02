import prisma from "@/lib/prisma"


/**
 * Met à jour le téléphone vérifié d'un utilisateur dans la base
 * @param userId - L'identifiant unique de l'utilisateur
 * @param phoneNumber - Le numéro de téléphone à enregistrer et valider
 */
export async function updateUserPhoneVerified(
  userId: string,
  phoneNumber: string
) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        phone: phoneNumber,
        phoneVerified: true,
      },
    });
    return updatedUser;
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du téléphone utilisateur:",
      error
    );
    throw error;
  }
}
