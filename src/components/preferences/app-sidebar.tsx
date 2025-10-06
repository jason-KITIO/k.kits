"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { NavMain } from "@/components/preferences/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import { useSidebarData } from "./sidebar/useSidebarData";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { navMain, navSecondary } = useSidebarData(pathname);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
