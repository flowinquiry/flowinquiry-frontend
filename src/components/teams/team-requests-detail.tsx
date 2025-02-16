"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Loader2,
  MessageSquarePlus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import AttachmentView from "@/components/shared/attachment-view";
import AuditLogView from "@/components/shared/audit-log-view";
import { UserAvatar } from "@/components/shared/avatar-display";
import CommentsView from "@/components/shared/comments-view";
import EntityWatchers from "@/components/shared/entity-watchers";
import { NColumnsGrid } from "@/components/shared/n-columns-grid";
import TeamNavLayout from "@/components/teams/team-nav";
import TeamRequestHealthLevel from "@/components/teams/team-requests-health-level";
import { PriorityDisplay } from "@/components/teams/team-requests-priority-display";
import TeamRequestsTimelineHistory from "@/components/teams/team-requests-timeline-history";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePagePermission } from "@/hooks/use-page-permission";
import {
  findNextTeamRequest,
  findPreviousTeamRequest,
  findRequestById,
  updateTeamRequest,
} from "@/lib/actions/teams-request.action";
import { getValidTargetStates } from "@/lib/actions/workflows.action";
import { formatDateTimeDistanceToNow } from "@/lib/datetime";
import { obfuscate } from "@/lib/endecode";
import { navigateToRecord } from "@/lib/navigation-record";
import { getSpecifiedColor, randomPair } from "@/lib/utils";
import { BreadcrumbProvider } from "@/providers/breadcrumb-provider";
import { useError } from "@/providers/error-provider";
import { useUserTeamRole } from "@/providers/user-team-role-provider";
import { PermissionUtils } from "@/types/resources";
import { TeamRequestDTO } from "@/types/team-requests";
import { WorkflowStateDTO } from "@/types/workflows";

import WorkflowReviewDialog from "../workflows/workflow-review-dialog";

const TeamRequestDetailView = ({
  teamRequestId,
}: {
  teamRequestId: number;
}) => {
  const permissionLevel = usePagePermission();
  const teamRole = useUserTeamRole().role;
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState("comments");
  const [teamRequest, setTeamRequest] = useState<TeamRequestDTO>(
    {} as TeamRequestDTO,
  );
  const [loading, setLoading] = useState(true);
  const { setError } = useError();
  const [workflowStates, setWorkflowStates] = useState<WorkflowStateDTO[]>([]);
  const [currentRequestState, setCurrentRequestState] = useState<String>("");
  const [isWorkflowDialogOpen, setWorkflowDialogOpen] = useState(false);

  // Create a reference for the CommentsView
  const commentsViewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchRequest = async () => {
      setLoading(true);
      try {
        const data = await findRequestById(teamRequestId, setError);
        if (!data) {
          throw new Error("Could not find the specified team request.");
        }
        setTeamRequest(data);
        setCurrentRequestState(data.currentStateName!);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [teamRequestId, setError]);

  useEffect(() => {
    const loadWorkflowStates = async () => {
      if (teamRequest?.workflowId && teamRequest?.currentStateId) {
        const data = await getValidTargetStates(
          teamRequest.workflowId,
          teamRequest.currentStateId,
          true,
          setError,
        );
        setWorkflowStates(data);
      }
    };

    loadWorkflowStates();
  }, [teamRequest?.workflowId, teamRequest?.currentStateId]);

  const handleViewWorkflow = () => {
    setWorkflowDialogOpen(true);
  };

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

  const handleFocusComments = () => {
    setSelectedTab("comments"); // Ensure the Comments tab is active

    // Delay scrolling slightly to allow UI to update first
    setTimeout(() => {
      if (commentsViewRef.current) {
        commentsViewRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  const handleStateChangeRequest = async (state: WorkflowStateDTO) => {
    const updatedRequest = {
      ...teamRequest,
      currentStateId: state.id,
      currentStateName: state.stateName,
    };
    await updateTeamRequest(updatedRequest.id!, updatedRequest, setError);
    setTeamRequest(updatedRequest);
    setCurrentRequestState(state.stateName);
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
            <Button
              variant="outline"
              className="h-6 w-6"
              size="icon"
              onClick={navigateToNextRecord}
            >
              <ChevronRight className="text-gray-400" />
            </Button>
          </div>
          <div className="flex flex-row gap-4 w-full justify-end">
            {(PermissionUtils.canWrite(permissionLevel) ||
              teamRole === "Manager" ||
              teamRole === "Member") && (
              <Button
                variant="secondary"
                onClick={() =>
                  router.push(
                    `/portal/teams/${obfuscate(teamRequest.teamId)}/requests/${obfuscate(teamRequest.id)}/edit?${randomPair()}`,
                  )
                }
              >
                <Edit className="mr-2" /> Edit
              </Button>
            )}
            {(PermissionUtils.canWrite(permissionLevel) ||
              teamRole === "Manager" ||
              teamRole === "Member" ||
              teamRole === "Guest") && (
              <Button variant="secondary" onClick={handleFocusComments}>
                <MessageSquarePlus className="mr-2" /> Add comment
              </Button>
            )}
            {(PermissionUtils.canWrite(permissionLevel) ||
              teamRole === "Manager" ||
              teamRole === "Member") && (
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="flex items-center gap-2">
                      {currentRequestState}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuGroup>
                      {workflowStates
                        .filter(
                          (state) => state.id !== teamRequest.currentStateId,
                        ) // Exclude the current state
                        .map((state) => (
                          <DropdownMenuItem
                            key={state.id}
                            onClick={() => handleStateChangeRequest(state)}
                            className="cursor-pointer"
                          >
                            {state.stateName}
                          </DropdownMenuItem>
                        ))}

                      {workflowStates.filter(
                        (state) => state.id !== teamRequest.currentStateId,
                      ).length === 0 && (
                        <DropdownMenuItem disabled>
                          No available states
                        </DropdownMenuItem>
                      )}
                      {/* Add a separator before the "View Workflow" button */}
                      {(PermissionUtils.canWrite(permissionLevel) ||
                        teamRole === "Manager" ||
                        teamRole === "Member" ||
                        teamRole === "Guest") && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={handleViewWorkflow}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2" /> View Workflow
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* Workflow Dialog */}
                <WorkflowReviewDialog
                  workflowId={teamRequest.workflowId!}
                  open={isWorkflowDialogOpen}
                  onClose={() => setWorkflowDialogOpen(false)}
                />
              </div>
            )}
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
                  <div className="col-span-1 sm:col-span-2 text-sm font-medium flex items-start">
                    <span className="pt-1">Attachments</span>
                    <AttachmentView
                      entityType="Team_Request"
                      entityId={teamRequest.id!}
                    />
                  </div>
                )}
                {(teamRequest.numberWatchers ?? 0) > 0 && (
                  <div className="col-span-1 sm:col-span-2 text-sm font-medium flex items-start gap-4">
                    <span className="pt-1">Watchers</span>
                    <EntityWatchers
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
                    <div ref={commentsViewRef}>
                      <CommentsView
                        entityType="Team_Request"
                        entityId={teamRequest.id!}
                      />
                    </div>
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
