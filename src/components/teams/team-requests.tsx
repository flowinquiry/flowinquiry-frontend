"use client";

import { Plus } from "lucide-react";
import React, { useState } from "react";

import { Heading } from "@/components/heading";
import NewRequestToTeamDialog from "@/components/teams/team-new-request-dialog";
import { Button } from "@/components/ui/button";
import { ViewProps } from "@/components/ui/ext-form";
import { usePagePermission } from "@/hooks/use-page-permission";
import { useUserTeamRole } from "@/providers/user-team-role-provider";
import { PermissionUtils } from "@/types/resources";
import { TeamType } from "@/types/teams";

const TeamRequestsView = ({ entity: team }: ViewProps<TeamType>) => {
  const permissionLevel = usePagePermission();
  const teamRole = useUserTeamRole().role;
  const [open, setOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex flex-row justify-between">
        <div className="flex-shrink-0">
          <Heading title={`Requests`} description="Manage team requests" />
        </div>
        {(PermissionUtils.canWrite(permissionLevel) ||
          teamRole === "Manager" ||
          teamRole === "Member" ||
          teamRole === "Guest") && (
          <div>
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> New Request
            </Button>
            <NewRequestToTeamDialog
              open={open}
              setOpen={setOpen}
              teamEntity={team}
              onSaveSuccess={() => console.log("Save success")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamRequestsView;
