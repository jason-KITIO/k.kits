"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { ProtectedSidebar } from "@/components/protected-sidebar";
import { Header } from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { usePathname, useParams } from "next/navigation";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const params = useParams();
  const organizationId = params.id as string;
  
  // Ne pas afficher la sidebar pour les routes stores/[storeId]
  const isStoreRoute = pathname?.includes('/stores/') && pathname?.split('/').length > 5;
  
  if (isStoreRoute) {
    return children;
  }

  return (
    <SidebarProvider>
      <ProtectedSidebar organizationId={organizationId} />
      <SidebarInset>
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
