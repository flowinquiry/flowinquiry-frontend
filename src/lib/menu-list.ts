import {
  Layers,
  LayoutGrid,
  LucideIcon,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Permission } from "@/providers/permissions-provider";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(
  pathname: string,
  permissions: Permission[],
): Group[] {
  // Helper function to check if a menu or submenu is enabled
  const isMenuEnabled = (menuLabel: string): boolean => {
    if (menuLabel === "Dashboard") {
      return true; // Always enable "Dashboard"
    }
    const permission = permissions.find(
      (perm) => perm.resourceName === menuLabel,
    );
    return permission ? permission.permission !== "NONE" : false;
  };

  // Helper function to filter menus recursively
  const filterMenus = (menus: Menu[]): Menu[] => {
    return menus
      .map((menu) => {
        // Recursively filter submenus
        const filteredSubmenus = menu.submenus
          ? menu.submenus.filter((submenu) => isMenuEnabled(submenu.label))
          : [];

        // Check if the menu itself or its submenus are enabled
        if (isMenuEnabled(menu.label) || filteredSubmenus.length > 0) {
          return {
            ...menu,
            submenus: filteredSubmenus,
          };
        }

        return null; // Exclude the menu if it's not enabled
      })
      .filter(Boolean) as Menu[]; // Remove null values
  };

  // Define the full menu structure
  const groups: Group[] = [
    {
      groupLabel: "",
      menus: [
        {
          href: "/portal",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/portal/teams",
          label: "Teams",
          icon: Layers,
        },
      ],
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/portal/users",
          label: "Users",
          icon: Users,
        },
        {
          href: "/portal/settings/authorities",
          label: "Authorities",
          icon: ShieldCheck,
        },
      ],
    },
  ];

  // Filter the groups and their menus
  return groups
    .map((group) => {
      const filteredMenus = filterMenus(group.menus);
      if (filteredMenus.length > 0) {
        return {
          ...group,
          menus: filteredMenus,
        };
      }
      return null; // Exclude the group if it has no enabled menus
    })
    .filter(Boolean) as Group[]; // Remove null groups
}
