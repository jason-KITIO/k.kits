"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { NavOrganisation } from "./nav-organisation";
import { useUserPermissions } from "@/hooks/use-auth-with-roles";
import { usePermissions } from "@/hooks/use-permissions";
import { SidebarSkeleton } from "./sidebar-skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebarNavigation } from "./sidebar/useSidebarNavigation";
import { useFilteredNavigation } from "./sidebar/useFilteredNavigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const orgId = React.useMemo(() => {
    if (!pathname) return null;
    const match = pathname.match(/\/preferences\/organizations\/([^\/]+)/);
    return match ? match[1] : null;
  }, [pathname]);

  const userPermissions = useUserPermissions(orgId || undefined);
  const { is } = usePermissions(orgId || undefined);

  if (!mounted) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div><SidebarSkeleton /></div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Chargement de la navigation...</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  const baseUrl = orgId ? `/preferences/organizations/${orgId}` : null;
  const { allNavItems, navSecondary, allQuickActions } = useSidebarNavigation(baseUrl, pathname, is.owner);
  const { navMainWithBadges, quickActions } = useFilteredNavigation(allNavItems, allQuickActions, userPermissions, is.owner);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <NavOrganisation />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainWithBadges} />
        <NavProjects projects={quickActions} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
