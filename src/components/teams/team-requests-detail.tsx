"use client";

import { ChevronLeft, ChevronRight, Edit } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

import { UserAvatar } from "@/components/shared/avatar-display";
import { PriorityDisplay } from "@/components/teams/team-requests-priority-display";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ViewProps } from "@/components/ui/ext-form";
import { usePagePermission } from "@/hooks/use-page-permission";
import {
  findNextTeamRequest,
  findPreviousTeamRequest,
} from "@/lib/actions/teams-request.action";
import { formatDateTimeDistanceToNow } from "@/lib/datetime";
import { obfuscate } from "@/lib/endecode";
import { navigateToRecord } from "@/lib/navigation-record";
import { PermissionUtils } from "@/types/resources";
import { TeamRequestType } from "@/types/teams";

const TeamRequestDetailView = ({ entity }: ViewProps<TeamRequestType>) => {
  const permissionLevel = usePagePermission();
  const router = useRouter();
  const pathname = usePathname();

  const [teamRequest, setTeamRequest] = useState<TeamRequestType>(entity);

  const navigateToPreviousRecord = async () => {
    const previousTeamRequest = await navigateToRecord(
      findPreviousTeamRequest,
      "You reach the first record",
      teamRequest.id!,
    );
    setTeamRequest(previousTeamRequest);
  };

  const navigateToNextRecord = async () => {
    const nextAccount = await navigateToRecord(
      findNextTeamRequest,
      "You reach the last record",
      teamRequest.id!,
    );
    setTeamRequest(nextAccount);
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Header Section */}
      <div className="flex flex-row justify-between gap-4 items-center">
        <Button
          variant="outline"
          className="h-6 w-6"
          size="icon"
          onClick={navigateToPreviousRecord}
        >
          <ChevronLeft className="text-gray-400" />
        </Button>
        <div className="text-2xl w-full font-semibold">
          {teamRequest.requestTitle}
        </div>
        {PermissionUtils.canWrite(permissionLevel) && (
          <Button
            onClick={() =>
              router.push(
                `/portal/teams/${teamRequest.teamId}/requests/${obfuscate(
                  teamRequest.id,
                )}/edit`,
              )
            }
          >
            <Edit className="mr-2" /> Edit
          </Button>
        )}
        <Button
          variant="outline"
          className="h-6 w-6"
          size="icon"
          onClick={navigateToNextRecord}
        >
          <ChevronRight className="text-gray-400" />
        </Button>
      </div>

      {/* Card Section */}
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Request Details Section */}
          <div>
            <p>
              <strong>Description:</strong>{" "}
              <p
                className="prose"
                dangerouslySetInnerHTML={{
                  __html: teamRequest.requestDescription!,
                }}
              />
            </p>
            <p>
              <strong>Priority:</strong>{" "}
              <PriorityDisplay priority={teamRequest.priority} />
            </p>
            <p>
              <strong>State:</strong> {teamRequest.currentState}
            </p>
          </div>

          {/* User Section */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Users</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <UserAvatar
                  imageUrl={teamRequest.requestUserImageUrl}
                  size="w-10 h-10"
                />
                <div>
                  <p className="font-medium">Request User</p>
                  <p>{teamRequest.requestUserName || "Unassigned"}</p>
                </div>
              </div>
              {teamRequest.assignUserId && (
                <div className="flex items-center gap-2">
                  <UserAvatar
                    imageUrl={teamRequest.assignUserImageUrl}
                    size="w-10 h-10"
                  />
                  <div>
                    <p className="font-medium">Assigned User</p>
                    <p>{teamRequest.assignUserName}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Metadata Section */}
          <div>
            <p>
              <strong>Created Date:</strong>{" "}
              {formatDateTimeDistanceToNow(new Date(teamRequest.createdDate!))}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamRequestDetailView;
