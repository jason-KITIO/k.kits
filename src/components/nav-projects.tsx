"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { useState } from "react";
import { useOrganizationIdFromUrl } from "@/helper/get-orgnisation-id";
// import { InvitationModal } from "./invitation/invitation-modal";:

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const [isInviteOpen, setInviteOpen] = useState(false);
  const organizationId = useOrganizationIdFromUrl();

  function openInvitationModal() {
    setInviteOpen(true);
  }

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <SidebarMenu>
          {projects.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <Button onClick={openInvitationModal} variant={"outline"}>
            Inviter un utilisateur
          </Button>
        </SidebarMenu>
      </SidebarGroup>

      {organizationId &&
        "invitation"
        // <InvitationModal
        //   open={isInviteOpen}
        //   onOpenChange={setInviteOpen}
        //   organizationId={organizationId}
        // />
      }
    </>
  );
}
