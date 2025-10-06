import { useMemo } from "react";
import { LifeBuoy, Send, Store, Edit } from "lucide-react";
import { User } from "@solar-icons/react";

export function useSidebarData(pathname: string) {
  const navMain = useMemo(() => [
    {
      title: "Authentification 2FA",
      url: "/preferences/legacy-2FA",
      icon: User,
      isActive: pathname === "/preferences/legacy-2FA",
    },
    {
      title: "Personnalisation",
      url: "/preferences/personalisation",
      icon: Edit,
      isActive: pathname === "/preferences/personalisation",
    },
    {
      title: "Organisations",
      url: "/preferences/organizations",
      icon: Store,
      isActive: pathname === "/preferences/organizations",
    },
  ], [pathname]);

  const navSecondary = useMemo(() => [
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: Send,
    },
  ], []);

  return { navMain, navSecondary };
}
