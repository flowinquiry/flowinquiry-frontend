"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { Heading } from "@/components/heading";
import { TeamAvatar } from "@/components/shared/avatar-display";
import AddUserToTeamDialog from "@/components/teams/team-add-user-dialog";
import TeamDashboardTopSection from "@/components/teams/team-dashboard-kpis";
import RecentTeamActivities from "@/components/teams/team-dashboard-recent-activities";
import TeamNavLayout from "@/components/teams/team-nav";
import TicketCreationByDaySeriesChart from "@/components/teams/team-requests-creation-timeseries-chart";
import TicketDistributionChart from "@/components/teams/team-requests-distribution-chart";
import TeamOverdueTickets from "@/components/teams/team-requests-overdue";
import TicketPriorityPieChart from "@/components/teams/team-requests-priority-chart";
import UnassignedTickets from "@/components/teams/team-requests-unassigned";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePagePermission } from "@/hooks/use-page-permission";
import { checkTeamHasAnyManager } from "@/lib/actions/teams.action";
import { obfuscate } from "@/lib/endecode";
import { cn } from "@/lib/utils";
import { BreadcrumbProvider } from "@/providers/breadcrumb-provider";
import { useTeam } from "@/providers/team-provider";
import { PermissionUtils } from "@/types/resources";

const TeamDashboard = () => {
  const team = useTeam();
  const permissionLevel = usePagePermission();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [checkingManager, setCheckingManager] = useState(true);

  useEffect(() => {
    const fetchManagerStatus = async () => {
      setCheckingManager(true);
      const response = await checkTeamHasAnyManager(team.id!);
      if (!response.result) {
        setDialogOpen(true);
      }
      setCheckingManager(false);
    };

    fetchManagerStatus();
  }, [team.id]);

  const breadcrumbItems = [
    { title: "Dashboard", link: "/portal" },
    { title: "Teams", link: "/portal/teams" },
    { title: team.name, link: "#" },
  ];

  return (
    <BreadcrumbProvider items={breadcrumbItems}>
      <TeamNavLayout teamId={team.id!}>
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
                title="Dashboard"
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
                <RecentTeamActivities teamId={team.id!} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="flex flex-col">
                <UnassignedTickets teamId={team.id!} />
              </div>
              <div className="flex flex-col">
                <TeamOverdueTickets teamId={team.id!} />
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
      </TeamNavLayout>

      {/* Show Dialog If No Manager Exists */}
      {!checkingManager && isDialogOpen && (
        <AddUserToTeamDialog
          open={isDialogOpen}
          setOpen={setDialogOpen}
          teamEntity={team}
          onSaveSuccess={() => setDialogOpen(false)}
          forceManagerAssignment={true}
        />
      )}
    </BreadcrumbProvider>
  );
};

export default TeamDashboard;
