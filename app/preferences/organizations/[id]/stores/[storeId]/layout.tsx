"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ProtectedStoreSidebar } from "@/components/protected-store-sidebar";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <ProtectedStoreSidebar />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}