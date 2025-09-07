"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronsUpDown, Plus } from "lucide-react";

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
import { useStores } from "@/hooks/useStore";

export function NavStore() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();

  // Extraire orgId et storeId de l'URL
  const { orgId, storeId } = React.useMemo(() => {
    if (!pathname) return { orgId: null, storeId: null };
    const match = pathname.match(/\/preferences\/organizations\/([^\/]+)\/stores\/([^\/]+)/);
    return match ? { orgId: match[1], storeId: match[2] } : { orgId: null, storeId: null };
  }, [pathname]);

  const { data: stores, isLoading, isError } = useStores(orgId || "");

  const [activeStore, setActiveStore] = React.useState<
    NonNullable<typeof stores>[number] | null
  >(null);

  // Met à jour la boutique active
  React.useEffect(() => {
    if (!stores || stores.length === 0) return;

    if (storeId) {
      const foundStore = stores.find((store) => store.id === storeId);
      if (foundStore && foundStore !== activeStore) {
        setActiveStore(foundStore);
        return;
      }
    }

    if (!activeStore) {
      setActiveStore(stores[0]);
    }
  }, [stores, storeId, activeStore]);

  function handleStoreSelect(store: NonNullable<typeof stores>[number]) {
    setActiveStore(store);
    router.push(`/preferences/organizations/${orgId}/stores/${store.id}`);
  }

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="p-4 text-center text-sm text-muted-foreground">
            Chargement des boutiques...
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (isError || !stores) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="p-4 text-center text-sm text-red-600">
            Erreur lors du chargement des boutiques
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!activeStore) {
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
              <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary">
                <div className="text-sm font-bold text-white">
                  {activeStore.name.charAt(0)}
                </div>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeStore.name}</span>
                <span className="truncate text-xs">{activeStore.type}</span>
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
            {stores.slice(0, 3).map((store, index) => (
              <DropdownMenuItem
                key={store.id}
                onClick={() => handleStoreSelect(store)}
                className="gap-2 p-2 flex items-center"
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-sidebar-primary">
                  <div className="text-sm font-bold text-white">
                    {store.name.charAt(0)}
                  </div>
                </div>
                <span className="ml-2 flex-1">{store.name}</span>
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            {stores.length > 3 && (
              <DropdownMenuItem
                onClick={() => router.push(`/preferences/organizations/${orgId}/stores`)}
                className="gap-2 p-2 text-muted-foreground"
              >
                Voir toutes les boutiques ({stores.length})
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => {
                router.push(`/preferences/organizations/${orgId}/stores/new`);
              }}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                Créer une boutique
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}