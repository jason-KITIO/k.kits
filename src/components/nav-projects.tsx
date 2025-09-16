"use client";

import { Search, TrendingUp, type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { useOrganizationIdFromUrl } from "@/helper/get-orgnisation-id";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { InvitationModal } from "./invitation/invitation-modal";

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const organizationId = useOrganizationIdFromUrl();
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);

  // Ajout de l'écouteur d'événement pour le raccourci clavier
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Détecte Ctrl+K ou Cmd+K
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchModalOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Le reste de votre composant...
  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Action Rapide</SidebarGroupLabel>
        <SidebarMenu>
          <Button
            // Ce bouton peut maintenant ouvrir le modal de recherche
            onClick={() => setSearchModalOpen(true)}
            variant={"ghost"}
            className="flex flex-row justify-start items-center"
          >
            <Search />
            Recherche rapide
          </Button>
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
          {organizationId && (
            <InvitationModal 
              organizationId={organizationId}
              trigger={
                <Button variant={"outline"} className="w-full justify-start">
                  Inviter un utilisateur
                </Button>
              }
            />
          )}
        </SidebarMenu>
      </SidebarGroup>



      <Dialog open={isSearchModalOpen} onOpenChange={setSearchModalOpen}>
        {/* <DialogTitle>Recherche</DialogTitle> */}
        <DialogContent>
          <Input placeholder="Tapez votre recherche..." autoFocus />
          {/* Ajouter ici la logique de recherche */}
        </DialogContent>
      </Dialog>
    </>
  );
}
