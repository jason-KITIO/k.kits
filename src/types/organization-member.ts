export interface OrganizationMember {
  id: string;
  active: boolean;
  joinedAt: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    lastSignInAt?: string;
  };
  role: {
    id: string;
    name: string;
    color?: string;
  };
}