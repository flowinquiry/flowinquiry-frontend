"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Heading } from "@/components/heading";
import { TeamAvatar } from "@/components/shared/avatar-display";
import TeamDashboardTopSection from "@/components/teams/team-dashboard-kpis";
import RecentTeamActivities from "@/components/teams/team-dashboard-recent-activity";
import TicketCreationByDaySeriesChart from "@/components/teams/team-requests-creation-timeseries-chart";
import TicketDistributionChart from "@/components/teams/team-requests-distribution-chart";
import OverdueTickets from "@/components/teams/team-requests-overdue";
import TicketPriorityPieChart from "@/components/teams/team-requests-priority-chart";
import UnassignedTickets from "@/components/teams/team-requests-unassigned";
import { buttonVariants } from "@/components/ui/button";
import { ViewProps } from "@/components/ui/ext-form";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger>
              <TeamAvatar imageUrl={team.logoUrl} size="w-20 h-20" />
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-left">
                <p className="font-bold">{team.name}</p>
                <p className="text-sm text-gray-500">
                  {team.slogan ?? "Stronger Together"}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
          <Heading
            title="Team Dashboard"
            description="Overview of your team's performance and activities. Monitor team requests, progress, and key metrics at a glance"
          />
        </div>
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
        <TeamDashboardTopSection teamId={team.id!} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col">
            <TicketCreationByDaySeriesChart teamId={team.id!} days={7} />
          </div>

          <div className="flex flex-col">
            <RecentTeamActivities team={team} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="flex flex-col">
            <UnassignedTickets teamId={team.id!} />
          </div>
          <div className="flex flex-col">
            <OverdueTickets teamId={team.id!} />
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex-1 min-w-[400px] max-w-[600px]">
            <TicketDistributionChart teamId={team.id!} />
          </div>
          <div className="flex-1 min-w-[400px] max-w-[600px]">
            <TicketPriorityPieChart teamId={team.id!} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDashboard;
