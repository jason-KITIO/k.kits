import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

interface OrganizationPageProps {
  params: {
    id: string;
  };
}

export default async function OrganizationPage({
  params,
}: OrganizationPageProps) {
  const { id } = params;

  const organization = await prisma.organization.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      domain: true,
      logo: true,
      address: true,
      phone: true,
      email: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!organization) {
    // Afficher une 404 si organisation non trouvée
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{organization.name}</h1>

      {organization.logo && (
        <img
          src={organization.logo}
          alt={`${organization.name} logo`}
          className="w-48 h-auto rounded mb-6"
        />
      )}

      <div className="space-y-3 text-gray-700">
        {organization.description && <p>{organization.description}</p>}

        {organization.domain && (
          <p>
            <strong>Domaine : </strong> {organization.domain}
          </p>
        )}

        {organization.address && (
          <p>
            <strong>Adresse : </strong> {organization.address}
          </p>
        )}

        {organization.phone && (
          <p>
            <strong>Téléphone : </strong> {organization.phone}
          </p>
        )}

        {organization.email && (
          <p>
            <strong>Email : </strong> {organization.email}
          </p>
        )}

        <p>
          <strong>Statut : </strong>{" "}
          {organization.active ? "Active" : "Inactive"}
        </p>

        <p>
          <strong>Créée le : </strong>{" "}
          {new Date(organization.createdAt).toLocaleDateString()}
        </p>

        <p>
          <strong>Dernière mise à jour : </strong>{" "}
          {new Date(organization.updatedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
