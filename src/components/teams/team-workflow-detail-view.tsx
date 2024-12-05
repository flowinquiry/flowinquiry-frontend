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

const WorkflowDetailView = ({ workflowId }: { workflowId: number }) => {
  const team = useTeam();
  const [workflowDetail, setWorkflowDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  const workflowDetails: WorkflowDetailedDTO = {
    id: 1,
    requestName: "ABC",
    name: "Sample Workflow",
    description: "This is a sample workflow",
    ownerName: "John Doe",
    states: [
      {
        id: 1,
        workflowId: 1,
        stateName: "Start",
        isInitial: true,
        isFinal: false,
      },
      {
        id: 2,
        workflowId: 1,
        stateName: "In Progress",
        isInitial: false,
        isFinal: false,
      },
      {
        id: 3,
        workflowId: 1,
        stateName: "Completed",
        isInitial: false,
        isFinal: true,
      },
    ],
    transitions: [
      {
        id: 1,
        workflowId: 1,
        sourceStateId: 1,
        targetStateId: 2,
        eventName: "Begin",
        slaDuration: 3600,
        escalateOnViolation: false,
      },
      {
        id: 2,
        workflowId: 1,
        sourceStateId: 2,
        targetStateId: 3,
        eventName: "Finish",
        slaDuration: 7200,
        escalateOnViolation: true,
      },
    ],
  };

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
              <Heading
                title={`Workflow`}
                description="Monitor and handle your team's tickets. Stay on top of assignments and progress."
              />
            </div>
          </div>
          <div>
            <WorkflowDiagram workflowDetails={workflowDetail} />;
          </div>
        </div>
      </TeamNavLayout>
    </BreadcrumbProvider>
  );
};

export default WorkflowDetailView;
