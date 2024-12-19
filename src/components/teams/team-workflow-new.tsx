"use client";

import React, { useState } from "react";

import { Heading } from "@/components/heading";
import { TeamAvatar } from "@/components/shared/avatar-display";
import TeamNavLayout from "@/components/teams/team-nav";
import NewTeamWorkflowReferFromSharedOne from "@/components/teams/team-workflow-new-refer-shared-workflow";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import NewWorkflowFromScratch from "@/components/workflows/workflow-create-from-scratch";
import { obfuscate } from "@/lib/endecode";
import { BreadcrumbProvider } from "@/providers/breadcrumb-provider";
import { useTeam } from "@/providers/team-provider";

const TeamWorkflowNew = () => {
  const team = useTeam();
  const [selectedOption, setSelectedOption] = useState<
    "scratch" | "clone" | null
  >(null);

  const breadcrumbItems = [
    { title: "Dashboard", link: "/portal" },
    { title: "Teams", link: "/portal/teams" },
    {
      title: team.name,
      link: `/portal/teams/${obfuscate(team.id)}`,
    },
    {
      title: "Workflows",
      link: `/portal/teams/${obfuscate(team.id)}/workflows`,
    },
    { title: "New", link: "#" },
  ];

  const renderComponent = () => {
    switch (selectedOption) {
      case "scratch":
        return <NewWorkflowFromScratch teamId={team.id!} />;
      case "clone":
        return (
          <NewTeamWorkflowReferFromSharedOne
            teamId={team.id!}
            isRefer={false}
          />
        );
      default:
        return null;
    }
  };

  const isLink = !selectedOption;

  return (
    <BreadcrumbProvider items={breadcrumbItems}>
      <TeamNavLayout teamId={team.id!}>
        <div className="grid grid-cols-1 gap-4">
          {/* Header Section */}
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
                title="Create New Workflow"
                description="Select how you want to create the workflow"
              />
            </div>
          </div>

          {/* Render selected component or options */}
          {isLink ? (
            <div>
              <h3 className="text-md font-semibold mb-4">Choose an Option</h3>
              <div className="space-y-6">
                {/* Create from Scratch */}
                <div className="flex items-start">
                  <Button
                    onClick={() => setSelectedOption("scratch")}
                    variant="link"
                    className="h-5"
                  >
                    Create from Scratch
                  </Button>
                  <div className="text-sm text-gray-500">
                    Start building a new workflow from the ground up.
                  </div>
                </div>

                {/* Clone from Global Workflow */}
                <div className="flex items-start">
                  <Button
                    onClick={() => setSelectedOption("clone")}
                    variant="link"
                    className="h-5"
                  >
                    Clone from Global Workflow
                  </Button>
                  <div className="text-sm text-gray-500">
                    Create a copy of a global workflow and customize it.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>{renderComponent()}</div>
          )}
        </div>
      </TeamNavLayout>
    </BreadcrumbProvider>
  );
};

export default TeamWorkflowNew;
