import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function verifyLocationOwnership(
  locationId: string,
  organizationId: string
) {
  const location = await prisma.stockLocation.findUnique({
    where: { id: locationId },
    include: { warehouse: true },
  });
  if (!location || location.warehouse.organizationId !== organizationId) {
    return null;
  }
  return location;
}
