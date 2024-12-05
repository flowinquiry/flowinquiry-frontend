"use client";

import { Activity, ArrowRightCircleIcon, Shuffle, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { obfuscate } from "@/lib/endecode";
import { cn } from "@/lib/utils";
import { useBreadcrumb } from "@/providers/breadcrumb-provider";

const TeamNavLayout = ({
  teamId,
  children,
}: {
  teamId: number;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();

  const teamFeatures = [
    {
      href: `/portal/teams/${obfuscate(teamId)}/dashboard`,
      label: "Dashboard",
      icon: Activity,
    },
    {
      href: `/portal/teams/${obfuscate(teamId)}/members`,
      label: "Members",
      icon: Users,
    },
    {
      href: `/portal/teams/${obfuscate(teamId)}/requests`,
      label: "Tickets",
      icon: ArrowRightCircleIcon,
    },
    {
      href: `/portal/teams/${obfuscate(teamId)}/workflows`,
      label: "Workflows",
      icon: Shuffle,
    },
  ];

  const breadcrumbsItems = useBreadcrumb();

  return (
    <div className="h-full flex flex-col">
      {/* Breadcrumb Bar */}
      <Breadcrumbs items={breadcrumbsItems} />

      {/* Main Layout with Navigator and Content */}
      <div className="flex flex-1 gap-4 pt-4">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] h-full">
          <div>
            <nav className="space-y-2">
              {teamFeatures.map((feature) => (
                <Link
                  key={feature.href}
                  href={feature.href}
                  className={cn(
                    "flex items-center p-2 text-sm font-medium rounded-md",
                    pathname.startsWith(feature.href)
                      ? "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]"
                      : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]",
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
    </div>
  );
};

export default TeamNavLayout;
