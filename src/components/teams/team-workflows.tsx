"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { Heading } from "@/components/heading";
import { TeamAvatar } from "@/components/shared/avatar-display";
import { buttonVariants } from "@/components/ui/button";
import { ViewProps } from "@/components/ui/ext-form";
import { usePagePermission } from "@/hooks/use-page-permission";
import { getWorkflowsByTeam } from "@/lib/actions/workflows.action";
import { cn } from "@/lib/utils";
import { useUserTeamRole } from "@/providers/user-team-role-provider";
import { PermissionUtils } from "@/types/resources";
import { TeamDTO } from "@/types/teams";
import { WorkflowDTO } from "@/types/workflows";

const TeamWorkflowsView = ({ entity: team }: ViewProps<TeamDTO>) => {
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

  if (loading) return <div>Loading...</div>;

  return (
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
            className="w-[28rem] grid grid-cols-1 gap-4 border border-gray-200 px-4 py-4 rounded-2xl relative"
          >
            <div>{workflow.name}</div>
            <div>{workflow.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamWorkflowsView;
