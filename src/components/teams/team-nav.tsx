"use client";

import { ArrowRightCircleIcon, Shuffle, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { obfuscate } from "@/lib/endecode";
import { cn } from "@/lib/utils";

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
      href: `/portal/teams/${obfuscate(teamId)}/members`,
      label: "Members",
      icon: Users,
    },
    {
      href: `/portal/teams/${obfuscate(teamId)}/requests`,
      label: "Requests",
      icon: ArrowRightCircleIcon,
    },
    {
      href: `/portal/teams/${obfuscate(teamId)}/workflows`,
      label: "Workflows",
      icon: Shuffle,
    },
  ];

  return (
    <div className="flex h-full pt-4 gap-4">
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
  );
};

export default TeamNavLayout;
