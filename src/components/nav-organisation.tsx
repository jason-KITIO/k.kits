"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation"; // Import useRouter pour navigation
import { ChevronsUpDown, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useOrganizations } from "@/hooks/use-organizations";

export function NavOrganisation() {
  const { isMobile } = useSidebar();
  const router = useRouter(); // Hook router Next.js
  const pathname = usePathname(); // Récupère l'URL actuelle
  const { data: teams, isLoading, isError } = useOrganizations();

  // Extraction de l'ID d'organisation depuis l'URL via RegEx
  const orgIdFromUrl = React.useMemo(() => {
    if (!pathname) return null;
    const match = pathname.match(/\/organizations\/([^\/]+)/);
    return match ? match[1] : null;
  }, [pathname]);

  const [activeTeam, setActiveTeam] = React.useState<
    NonNullable<typeof teams>[number] | null
  >(null);

  // Met à jour l'équipe active dès que les données chargent ou si orgIdFromUrl change
  React.useEffect(() => {
    if (!teams || teams.length === 0) return;

    // Si un orgId est présent dans l'URL, on tente de sélectionner l'équipe correspondante
    if (orgIdFromUrl) {
      const foundTeam = teams.find((team) => team.id === orgIdFromUrl);
      if (foundTeam && foundTeam !== activeTeam) {
        setActiveTeam(foundTeam);
        return;
      }
    }

    // Sinon set la première équipe par défaut si aucune active
    if (!activeTeam) {
      setActiveTeam(teams[0]);
    }
  }, [teams, orgIdFromUrl, activeTeam]);

  // Handler de sélection d'une équipe dans le menu dropdown
  function handleTeamSelect(team: NonNullable<typeof teams>[number]) {
    setActiveTeam(team);
    // Navigate vers la page de l'organisation sélectionnée
    router.push(`/organizations/${team.id}`);
  }

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <Skeleton className="h-4 w-8 rounded-lg" />
            <div className="grid flex-1 text-left">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-3 w-[80px]" />
            </div>
            <Skeleton className="h-4 w-4" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (isError || !teams) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="p-4 text-center text-sm text-red-600">
            Erreur lors du chargement des équipes
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden">
                {activeTeam.logo ? (
                  <img
                    src={
                      activeTeam.logo === "https://example.com/logo.png"
                        ? "https://i.pinimg.com/736x/48/6c/02/486c02661aa64598399475d3f75752c5.jpg"
                        : activeTeam.logo
                    }
                    alt={`${activeTeam.name} logo`}
                    className="object-contain w-6 h-6"
                  />
                ) : (
                  <div className="text-sm font-bold">
                    {activeTeam.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeTeam.name}</span>
                <span className="truncate text-xs">{activeTeam.domain}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Boutiques
            </DropdownMenuLabel>
            {teams.slice(0, 3).map((team, index) => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => handleTeamSelect(team)}
                className="gap-2 p-2 flex items-center"
              >
                <div className="flex size-6 items-center justify-center rounded-md border overflow-hidden">
                  {team.logo ? (
                    <img
                      src={
                        team.logo === "https://example.com/logo.png"
                          ? "https://i.pinimg.com/736x/48/6c/02/486c02661aa64598399475d3f75752c5.jpg"
                          : team.logo
                      }
                      alt={`${team.name} logo`}
                      className="object-contain w-5 h-5"
                    />
                  ) : (
                    <div className="text-sm font-bold">
                      {team.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="ml-2 flex-1">{team.name}</span>
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            {teams.length > 3 && (
              <DropdownMenuItem
                onClick={() => router.push("/organizations")}
                className="gap-2 p-2 text-muted-foreground"
              >
                Voir toutes les boutiques ({teams.length})
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => {
                router.push("/preferences/organizations/create");
              }}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                Creer une boutique
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
