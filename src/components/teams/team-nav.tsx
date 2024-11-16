"use client";

import { Layout, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { obfuscate } from "@/lib/endecode";
import { cn } from "@/lib/utils";
import { TeamType } from "@/types/teams";

const TeamNavLayout = ({
  team,
  children,
}: {
  team: TeamType;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();

  const teamFeatures = [
    {
      href: `/portal/teams/${obfuscate(team.id)}/members`,
      label: "Members",
      icon: Users,
    },
    {
      href: `/portal/teams/${obfuscate(team.id)}/requests`,
      label: "Requests",
      icon: Layout,
    },
    {
      href: `/portal/teams/${obfuscate(team.id)}/workflows`,
      label: "Workflows",
      icon: Settings,
    },
  ];

  return (
    <div className="flex h-full pt-4 gap-4">
      <aside className="w-64 bg-gray-100 h-full">
        <div className="p-4">
          <nav className="mt-4 space-y-2">
            {teamFeatures.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className={cn(
                  "flex items-center p-2 text-sm font-medium rounded-md",
                  pathname.startsWith(feature.href)
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-700 hover:bg-gray-200",
                )}
              >
                <feature.icon className="w-5 h-5 mr-2" />
                {feature.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};

export default TeamNavLayout;
