"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { StoreSidebar } from "@/components/store-sidebar";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <StoreSidebar />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}