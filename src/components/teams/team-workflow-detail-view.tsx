"use client";

import React, { useEffect, useState } from "react";

import { Heading } from "@/components/heading";
import { TeamAvatar } from "@/components/shared/avatar-display";
import TeamNavLayout from "@/components/teams/team-nav";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import WorkflowDiagram from "@/components/workflows/workflow-diagram-view";
import { getWorkflowDetail } from "@/lib/actions/workflows.action";
import { obfuscate } from "@/lib/endecode";
import { BreadcrumbProvider } from "@/providers/breadcrumb-provider";
import { useTeam } from "@/providers/team-provider";
import { WorkflowDetailedDTO } from "@/types/workflows";
import { PermissionUtils } from "@/types/resources";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";
import AddUserToTeamDialog from "@/components/teams/team-add-user-dialog";
import { usePagePermission } from "@/hooks/use-page-permission";
import { useUserTeamRole } from "@/providers/user-team-role-provider";

const WorkflowDetailView = ({ workflowId }: { workflowId: number }) => {
  const team = useTeam();
  const [workflowDetail, setWorkflowDetail] =
    useState<WorkflowDetailedDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const permissionLevel = usePagePermission();
  const teamRole = useUserTeamRole().role;

  useEffect(() => {
    async function fetchWorkflowDetail() {
      getWorkflowDetail(workflowId)
        .then((data) => setWorkflowDetail(data))
        .finally(() => setLoading(false));
    }

    fetchWorkflowDetail();
  }, [workflowId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner className="mb-4">
          <span>Loading workflow detail...</span>
        </Spinner>
      </div>
    );
  }

  if (!workflowDetail) {
    return <div>Error loading workflow detail.</div>; // Optional error state
  }

  const breadcrumbItems = [
    { title: "Dashboard", link: "/portal" },
    { title: "Teams", link: "/portal/teams" },
    {
      title: workflowDetail.ownerName,
      link: `/portal/teams/${obfuscate(workflowDetail.ownerId)}`,
    },
    {
      title: "Workflows",
      link: `/portal/teams/${obfuscate(workflowDetail.ownerId)}/workflows`,
    },
    { title: workflowDetail.name, link: "#" },
  ];

  return (
    <BreadcrumbProvider items={breadcrumbItems}>
      <TeamNavLayout teamId={workflowDetail.ownerId!}>
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
              <Heading title={`Workflow`} description="View Workflow Detail" />
            </div>
            {(PermissionUtils.canWrite(permissionLevel) ||
              teamRole === "Manager") && (
              <div>
                <Button>
                  <Edit /> Customize Workflow
                </Button>
              </div>
            )}
          </div>
          <div>
            {workflowDetail && (
              <WorkflowDiagram workflowDetails={workflowDetail!} />
            )}
          </div>
        </div>
      </TeamNavLayout>
    </BreadcrumbProvider>
  );
};

export default WorkflowDetailView;
