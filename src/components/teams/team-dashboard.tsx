"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Heading } from "@/components/heading";
import TeamDashboardTopSection from "@/components/teams/team-dashboard-kpis";
import TeamPerformanceMetrics from "@/components/teams/team-dashboard-performance-metrics";
import DashboardTrendsAndActivity from "@/components/teams/team-dashboard-recent-activity";
import { buttonVariants } from "@/components/ui/button";
import { ViewProps } from "@/components/ui/ext-form";
import { Separator } from "@/components/ui/separator";
import { usePagePermission } from "@/hooks/use-page-permission";
import { obfuscate } from "@/lib/endecode";
import { cn } from "@/lib/utils";
import { PermissionUtils } from "@/types/resources";
import { TeamDTO } from "@/types/teams";

const TeamDashboard = ({ entity: team }: ViewProps<TeamDTO>) => {
  const permissionLevel = usePagePermission();

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex items-center justify-between">
        <Heading
          title={team.name}
          description={team.slogan ?? "Stronger Together"}
        />
        {PermissionUtils.canWrite(permissionLevel) && (
          <Link
            href={`/portal/teams/${obfuscate(team.id)}/edit`}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Edit Team
          </Link>
        )}
      </div>
      <Separator />
      <div className="space-y-8">
        <TeamDashboardTopSection />
        <DashboardTrendsAndActivity team={team} />
        <TeamPerformanceMetrics />
      </div>
    </div>
  );
};

export default TeamDashboard;
