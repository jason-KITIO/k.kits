"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Separator } from "@radix-ui/react-separator";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const { data, error, isLoading } = useCurrentUser();

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {(error as Error).message}</p>;

  const user = data?.user;

  if (!user) return <p>Utilisateur non trouvé ou non authentifié.</p>;

  const getPageTitle = () => {
    const pathMap: Record<string, string> = {
      dashboard: `Bonjour, ${user.username}`,
      products: "Vos produits",
      warehouses: "Vos entrepôts",
      "employee-stock": "Votre stock",
      transfers: "Vos transferts",
      inventories: "Vos inventaires",
      purchases: "Vos achats",
      suppliers: "Vos fournisseurs",
      alerts: "Vos alertes",
      reports: "Vos rapports",
      settings: "Paramètres",
      categories: "Catégories",
      stock: "Stock",
      create: "Créer",
      history: "Historique",
    };

    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    return (
      pathMap[lastSegment] ||
      lastSegment?.charAt(0).toUpperCase() + lastSegment?.slice(1) ||
      ""
    );
  };

  const generateBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs = [];

    for (let i = 0; i < segments.length; i++) {
      const href = "/" + segments.slice(0, i + 1).join("/");
      const label = segments[i].charAt(0).toUpperCase() + segments[i].slice(1);
      const isLast = i === segments.length - 1;

      breadcrumbs.push({
        href,
        label: label.replace(/-/g, " "),
        isLast,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex items-center gap-2">
          {/* <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center">
                  {index > 0 && (
                    <BreadcrumbSeparator className="hidden md:block" />
                  )}
                  <BreadcrumbItem className="hidden md:block">
                    {crumb.isLast ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={crumb.href}>
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb> */}
          <h1 className="text-lg font-semibold titre">{getPageTitle()}</h1>
        </div>
      </div>
    </header>
  );
}
