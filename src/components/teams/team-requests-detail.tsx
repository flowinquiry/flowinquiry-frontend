"use client";

import { ChevronLeft, ChevronRight, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import AuditLogView from "@/components/shared/audit-log-view";
import { UserAvatar } from "@/components/shared/avatar-display";
import CommentsView from "@/components/shared/comments-view";
import { NColumnsGrid } from "@/components/shared/n-columns-grid";
import { PriorityDisplay } from "@/components/teams/team-requests-priority-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ViewProps } from "@/components/ui/ext-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  const [selectedTab, setSelectedTab] = useState("comments");
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

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
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
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: teamRequest.requestDescription!,
                }}
              />
            </div>

            <NColumnsGrid
              columns={2}
              gap="4"
              className="col-span-1 sm:col-span-2"
              fields={[
                {
                  label: "Created",
                  value: formatDateTimeDistanceToNow(
                    new Date(teamRequest.createdDate!),
                  ),
                  colSpan: 1,
                },
                {
                  label: "Priority",
                  value: <PriorityDisplay priority={teamRequest.priority} />,
                  colSpan: 1,
                },
                {
                  label: "Request User",
                  value: (
                    <div className="flex items-center gap-2">
                      <UserAvatar
                        imageUrl={teamRequest.requestUserImageUrl}
                        size="w-6 h-6"
                      />
                      <Button variant="link" className="p-0 h-auto">
                        <Link
                          href={`/portal/users/${obfuscate(teamRequest.requestUserId)}`}
                        >
                          {teamRequest.requestUserName}
                        </Link>
                      </Button>
                    </div>
                  ),
                  colSpan: 1,
                },
                {
                  label: "Assign User",
                  value: teamRequest.assignUserId ? (
                    <div className="flex items-center gap-2">
                      <UserAvatar
                        imageUrl={teamRequest.assignUserImageUrl}
                        size="w-6 h-6"
                      />
                      <Button variant="link" className="p-0 h-auto">
                        <Link
                          href={`/portal/users/${obfuscate(teamRequest.assignUserId)}`}
                        >
                          {teamRequest.assignUserName}
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <span className="text-gray-500">No user assigned</span>
                  ),
                  colSpan: 1,
                },
                {
                  label: "Type",
                  value: (
                    <Badge variant="outline">
                      {teamRequest.workflowRequestName}
                    </Badge>
                  ),
                  colSpan: 1,
                },
                {
                  label: "Current State",
                  value: <Badge>{teamRequest.currentState}</Badge>,
                  colSpan: 1,
                },
                {
                  label: "Target Completion Date",
                  value: teamRequest.estimatedCompletionDate
                    ? new Date(
                        teamRequest.estimatedCompletionDate,
                      ).toDateString()
                    : "N/A",
                  colSpan: 1,
                },
                {
                  label: "Actual Completion Date",
                  value: teamRequest.actualCompletionDate
                    ? new Date(teamRequest.actualCompletionDate).toDateString()
                    : "N/A",
                  colSpan: 1,
                },
                {
                  label: "Channel",
                  value: teamRequest.channel && (
                    <Badge variant="outline">{teamRequest.channel}</Badge>
                  ),
                  colSpan: 1,
                },
              ]}
            />
          </div>
          <Tabs
            defaultValue="comments"
            value={selectedTab}
            onValueChange={handleTabChange}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="auditlog">History</TabsTrigger>
            </TabsList>
            <TabsContent value="comments">
              {selectedTab === "comments" && (
                <CommentsView
                  entityType="Team_Request"
                  entityId={teamRequest.id!}
                />
              )}
            </TabsContent>
            <TabsContent value="auditlog">
              {selectedTab === "auditlog" && (
                <AuditLogView
                  entityType="Team_Request"
                  entityId={teamRequest.id!}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamRequestDetailView;
