"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { hasPageAccess, getDefaultPageForRole } from "@/lib/role-redirect";

interface RoleRedirectProps {
  organizationId: string;
  children: React.ReactNode;
}

export function RoleRedirect({ organizationId, children }: RoleRedirectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const orgMember = user.organizationMembers?.find(
      (member) => member.organizationId === organizationId
    );

    if (!orgMember) return;

    const userPermissions = orgMember.role.permissions;
    
    if (!hasPageAccess(userPermissions, pathname)) {
      const defaultPage = getDefaultPageForRole(orgMember.role.name, organizationId);
      router.replace(defaultPage);
    }
  }, [user, organizationId, pathname, router]);

  return <>{children}</>;
}