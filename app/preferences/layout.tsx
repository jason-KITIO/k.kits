"use client";

import { AppSidebar } from "@/components/preferences/app-sidebar";
import { Header } from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  // Si on est dans une route [id], ne pas afficher le layout preferences
  const isInIdRoute = /\/preferences\/organizations\/[^/]+/.test(pathname);
  
  if (isInIdRoute) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
