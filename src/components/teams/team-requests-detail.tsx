"use client";

import { ChevronLeft, ChevronRight, Edit, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import AttachmentView from "@/components/shared/attachment-view";
import AuditLogView from "@/components/shared/audit-log-view";
import { UserAvatar } from "@/components/shared/avatar-display";
import CommentsView from "@/components/shared/comments-view";
import { NColumnsGrid } from "@/components/shared/n-columns-grid";
import TeamNavLayout from "@/components/teams/team-nav";
import { PriorityDisplay } from "@/components/teams/team-requests-priority-display";
import TeamRequestsTimelineHistory from "@/components/teams/team-requests-timeline-history";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePagePermission } from "@/hooks/use-page-permission";
import {
  findNextTeamRequest,
  findPreviousTeamRequest,
  findRequestById,
} from "@/lib/actions/teams-request.action";
import { formatDateTimeDistanceToNow } from "@/lib/datetime";
import { obfuscate } from "@/lib/endecode";
import { navigateToRecord } from "@/lib/navigation-record";
import { getSpecifiedColor, randomPair } from "@/lib/utils";
import { BreadcrumbProvider } from "@/providers/breadcrumb-provider";
import { useError } from "@/providers/error-provider";
import { PermissionUtils } from "@/types/resources";
import { TeamRequestDTO } from "@/types/team-requests";
import TeamRequestHealthLevel from "@/components/teams/team-requests-health-level";

const TeamRequestDetailView = ({
  teamRequestId,
}: {
  teamRequestId: number;
}) => {
  const permissionLevel = usePagePermission();
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState("comments");
  const [teamRequest, setTeamRequest] = useState<TeamRequestDTO | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);
  const { setError } = useError();

  useEffect(() => {
    const fetchRequest = async () => {
      setLoading(true);
      try {
        const data = await findRequestById(teamRequestId, setError);
        if (!data) {
          throw new Error("Could not find the specified team request.");
        }
        setTeamRequest(data);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [teamRequestId]);

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  const navigateToPreviousRecord = async () => {
    if (!teamRequest) return;
    const previousTeamRequest = await navigateToRecord(
      findPreviousTeamRequest,
      "You reach the first record",
      teamRequest.id!,
      setError,
    );
    setTeamRequest(previousTeamRequest);
  };

  const navigateToNextRecord = async () => {
    if (!teamRequest) return;
    const nextTeamRequest = await navigateToRecord(
      findNextTeamRequest,
      "You reach the last record",
      teamRequest.id!,
      setError,
    );
    setTeamRequest(nextTeamRequest);
  };

  if (loading) {
    return (
      <div className="py-4 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!teamRequest) {
    return (
      <div className="py-4">
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="text-red-500 mt-4">Team request not found</p>
        <div className="mt-4">
          <Button variant="secondary" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { title: "Dashboard", link: "/portal" },
    { title: "Teams", link: "/portal/teams" },
    {
      title: teamRequest.teamName!,
      link: `/portal/teams/${obfuscate(teamRequest.teamId)}`,
    },
    {
      title: "Tickets",
      link: `/portal/teams/${obfuscate(teamRequest.teamId)}/requests`,
    },
    { title: teamRequest.requestTitle!, link: "#" },
  ];

  const workflowColor = getSpecifiedColor(teamRequest.workflowRequestName!);

  return (
    <BreadcrumbProvider items={breadcrumbItems}>
      <TeamNavLayout teamId={teamRequest.teamId!}>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-row justify-between gap-4 items-center">
            <Button
              variant="outline"
              className="h-6 w-6"
              size="icon"
              onClick={navigateToPreviousRecord}
            >
              <ChevronLeft className="text-gray-400" />
            </Button>
            <div className="w-full flex gap-2 items-start">
              <span
                className="inline-block px-2 py-1 text-xs font-semibold rounded-md"
                style={{
                  backgroundColor: workflowColor.background,
                  color: workflowColor.text,
                }}
              >
                {teamRequest.workflowRequestName}
              </span>
              <div
                className={`text-2xl w-full font-semibold ${
                  teamRequest.isCompleted ? "line-through" : ""
                }`}
              >
                {teamRequest.requestTitle}
              </div>
            </div>

            {PermissionUtils.canWrite(permissionLevel) && (
              <Button
                onClick={() =>
                  router.push(
                    `/portal/teams/${obfuscate(teamRequest.teamId)}/requests/${obfuscate(teamRequest.id)}/edit?${randomPair()}`,
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
          {teamRequest.conversationHealth?.healthLevel && (
            <TeamRequestHealthLevel
              currentLevel={teamRequest.conversationHealth.healthLevel}
            />
          )}

          <Card>
            <CardContent className="p-4 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        new Date(teamRequest.createdAt!),
                      ),
                      tooltip: new Date(
                        teamRequest.createdAt!,
                      ).toLocaleString(),
                      colSpan: 1,
                    },
                    {
                      label: "Modified",
                      value: formatDateTimeDistanceToNow(
                        new Date(teamRequest.modifiedAt!),
                      ),
                      tooltip: new Date(
                        teamRequest.modifiedAt!,
                      ).toLocaleString(),
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
                      label: "Priority",
                      value: (
                        <PriorityDisplay priority={teamRequest.priority} />
                      ),
                      colSpan: 1,
                    },
                    {
                      label: "State",
                      value: (
                        <Badge variant="outline">
                          {teamRequest.currentStateName}
                        </Badge>
                      ),
                      colSpan: 1,
                    },
                    {
                      label: "Channel",
                      value: teamRequest.channel && (
                        <Badge variant="outline">{teamRequest.channel}</Badge>
                      ),
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
                        ? new Date(
                            teamRequest.actualCompletionDate,
                          ).toDateString()
                        : "N/A",
                      colSpan: 1,
                    },
                  ]}
                />

                {(teamRequest.numberAttachments ?? 0) > 0 && (
                  <div className="w-full flex text-sm font-medium text-neutral-500 dark:text-neutral-400 gap-2">
                    <span>Attachments</span>
                    <AttachmentView
                      entityType="Team_Request"
                      entityId={teamRequest.id!}
                    />
                  </div>
                )}
              </div>
              <Tabs
                defaultValue="comments"
                value={selectedTab}
                onValueChange={handleTabChange}
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                  <TabsTrigger value="changes-history">
                    Changes History
                  </TabsTrigger>
                  <TabsTrigger value="timeline-history">
                    Timeline History
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="comments">
                  {selectedTab === "comments" && (
                    <CommentsView
                      entityType="Team_Request"
                      entityId={teamRequest.id!}
                    />
                  )}
                </TabsContent>
                <TabsContent value="changes-history">
                  {selectedTab === "changes-history" && (
                    <AuditLogView
                      entityType="Team_Request"
                      entityId={teamRequest.id!}
                    />
                  )}
                </TabsContent>
                <TabsContent value="timeline-history">
                  {selectedTab === "timeline-history" && (
                    <TeamRequestsTimelineHistory teamId={teamRequest.id!} />
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </TeamNavLayout>
    </BreadcrumbProvider>
  );
};

export default TeamRequestDetailView;
