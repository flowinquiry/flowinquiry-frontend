"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { Heading } from "@/components/heading";
import { TeamAvatar } from "@/components/shared/avatar-display";
import TeamNavLayout from "@/components/teams/team-nav";
import { buttonVariants } from "@/components/ui/button";
import { usePagePermission } from "@/hooks/use-page-permission";
import { getWorkflowsByTeam } from "@/lib/actions/workflows.action";
import { obfuscate } from "@/lib/endecode";
import { cn } from "@/lib/utils";
import { BreadcrumbProvider } from "@/providers/breadcrumb-provider";
import { useTeam } from "@/providers/team-provider";
import { useUserTeamRole } from "@/providers/user-team-role-provider";
import { PermissionUtils } from "@/types/resources";
import { WorkflowDTO } from "@/types/workflows";

const TeamWorkflowsView = () => {
  const team = useTeam();
  const breadcrumbItems = [
    { title: "Dashboard", link: "/portal" },
    { title: "Teams", link: "/portal/teams" },
    { title: team.name, link: `/portal/teams/${obfuscate(team.id)}` },
    { title: "Workflows", link: "#" },
  ];

  const permissionLevel = usePagePermission();
  const teamRole = useUserTeamRole().role;
  const [loading, setLoading] = useState(false);
  const [workflows, setWorkflows] = useState<WorkflowDTO[]>([]);

  const fetchWorkflows = async () => {
    setLoading(true);
    try {
      const result = await getWorkflowsByTeam(team.id!);
      setWorkflows(result);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const getWorkflowViewRoute = (workflow: WorkflowDTO) => {
    if (workflow.ownerId === null) {
      return `/portal/settings/workflows/${obfuscate(workflow.id)}`;
    }
    return `/portal/teams/${obfuscate(workflow.ownerId)}/workflows/${obfuscate(workflow.id)}`;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <BreadcrumbProvider items={breadcrumbItems}>
      <TeamNavLayout teamId={team.id!}>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <TeamAvatar imageUrl={team.logoUrl} size="w-20 h-20" />
              <Heading
                title={team.name}
                description={team.slogan ?? "Stronger Together"}
              />
            </div>
            {(PermissionUtils.canWrite(permissionLevel) ||
              teamRole === "Manager") && (
              <Link
                href={"/portal/teams/new/edit"}
                className={cn(buttonVariants({ variant: "default" }))}
              >
                <Plus className="mr-2 h-4 w-4" /> New Workflow
              </Link>
            )}
          </div>
          <div className="flex flex-row flex-wrap gap-4 content-around">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className="relative w-[28rem] grid grid-cols-1 gap-4 border px-4 py-4 rounded-2xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                {workflow.ownerId === null && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-bl-lg">
                    Global
                  </div>
                )}
                <Link
                  href={`${getWorkflowViewRoute(workflow)}`}
                  className={cn(
                    buttonVariants({ variant: "link" }),
                    "w-full text-left block px-0",
                  )}
                >
                  {workflow.name}
                </Link>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {workflow.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </TeamNavLayout>
    </BreadcrumbProvider>
  );
};

export default TeamWorkflowsView;
