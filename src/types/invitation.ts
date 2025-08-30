import type {
  Invitation as PrismaInvitation,
  Organization,
  Role,
} from "@prisma/client";

export interface InvitationWithRelations extends PrismaInvitation {
  organization: Organization;
  role: Role;
}

export interface SendInvitationPayload {
  organizationId: string;
  email: string;
  roleId: string;
}

export interface AcceptInvitationPayload {
  token: string;
  username: string;
  password: string;
  organizationId: string;
}
