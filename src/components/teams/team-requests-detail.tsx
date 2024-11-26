"use client";

import { ChevronLeft, ChevronRight, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { UserAvatar } from "@/components/shared/avatar-display";
import CommentsView from "@/components/shared/comments-view";
import { PriorityDisplay } from "@/components/teams/team-requests-priority-display";
import { Badge } from "@/components/ui/badge";
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
import { TeamRequestDTO } from "@/types/teams";

const TeamRequestDetailView = ({ entity }: ViewProps<TeamRequestDTO>) => {
  const permissionLevel = usePagePermission();
  const router = useRouter();

  const [teamRequest, setTeamRequest] = useState<TeamRequestDTO>(entity);

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
                `/portal/teams/${obfuscate(teamRequest.teamId)}/requests/${obfuscate(teamRequest.id)}/edit`,
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

      <Card>
        <CardContent className="p-4 space-y-6">
          {/* Request Details Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Description - Full Width */}
            <div className="col-span-1 sm:col-span-2">
              <p className="font-medium">Description</p>
              <div
                className="prose"
                dangerouslySetInnerHTML={{
                  __html: teamRequest.requestDescription!,
                }}
              />
            </div>

            {/* Priority */}
            <div>
              <p className="font-medium">Priority</p>
              <PriorityDisplay priority={teamRequest.priority} />
            </div>

            {/* State */}
            <div>
              <p className="font-medium">State</p>
              <p>
                <Badge>{teamRequest.currentState}</Badge>
              </p>
            </div>

            {/* Request User */}
            <div>
              <p className="font-medium">Request User</p>
              <div className="flex items-center gap-2">
                <UserAvatar imageUrl={teamRequest.requestUserImageUrl} />
                {teamRequest.requestUserId != null ? (
                  <p>
                    <Button variant="link" className="p-0">
                      <Link
                        href={`/portal/users/${obfuscate(teamRequest.requestUserId)}`}
                      >
                        {teamRequest.requestUserName}
                      </Link>
                    </Button>
                  </p>
                ) : (
                  <p>Unassigned</p>
                )}
              </div>
            </div>

            {/* Assigned User */}
            <div>
              <p className="font-medium">Assigned User</p>
              {teamRequest.assignUserId != null ? (
                <div className="flex items-center gap-2">
                  <UserAvatar imageUrl={teamRequest.assignUserImageUrl} />
                  <p>{teamRequest.assignUserName}</p>
                </div>
              ) : (
                <p>Unassigned</p>
              )}
            </div>

            <div>
              <p className="font-medium">Created Date</p>
              <p>
                {formatDateTimeDistanceToNow(
                  new Date(teamRequest.createdDate!),
                )}
              </p>
            </div>
          </div>
          <CommentsView entityType="Team_Request" entityId={teamRequest.id!} />
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamRequestDetailView;
