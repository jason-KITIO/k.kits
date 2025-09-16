import { sendInvitationEmail as sendInvitationEmailBase } from "./email";

interface InvitationEmailData {
  email: string;
  organizationName: string;
  roleName: string;
  storeName?: string;
  token: string;
  inviterName?: string;
}

export async function sendInvitationEmail(data: InvitationEmailData) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const inviteLink = `${baseUrl}/invitation/accept?token=${data.token}`;
  
  await sendInvitationEmailBase(data.email, {
    role: data.roleName,
    organizationName: data.organizationName,
    invitationLink: inviteLink,
  });
}