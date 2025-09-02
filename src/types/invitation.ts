export interface Invitation {
  id: string;
  email: string;
  roleId: string;
  organizationId: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED" | "CANCELLED";
  token: string;
  createdAt: string;
  expiresAt: string;
  invitedBy?: string;
  role: {
    id: string;
    name: string;
    description?: string;
    color?: string;
  };
  organization: {
    name: string;
  };
}

export interface CreateInvitationData {
  email: string;
  roleId: string;
  storeId?: string;
}

export interface UpdateInvitationData {
  roleId?: string;
  storeId?: string;
  expiresAt?: string;
}

export interface InvitationValidation {
  valid: boolean;
  email?: string;
  organizationName?: string;
  roleName?: string;
  organizationId?: string;
  roleId?: string;
  error?: string;
}