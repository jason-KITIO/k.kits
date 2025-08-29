import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Connexion à la base de données réussie !');

    // Test basique : récupérer les premiers utilisateurs (ou modifier selon votre modèle)
    const users = await prisma.user.findMany({ take: 1 });
    console.log('Exemple d’utilisateur récupéré :', users);

    await prisma.$disconnect();
  } catch (error) {
    console.error('Erreur de connexion Prisma:', error);
  }
}

testConnection();
