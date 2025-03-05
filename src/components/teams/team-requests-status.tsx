"use client";

import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

import { UserAvatar } from "@/components/shared/avatar-display";
import TruncatedHtmlLabel from "@/components/shared/truncate-html-label";
import TeamRequestDetailSheet from "@/components/teams/team-request-detail-sheet";
import TeamRequestHealthLevel from "@/components/teams/team-requests-health-level";
import { PriorityDisplay } from "@/components/teams/team-requests-priority-display";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { obfuscate } from "@/lib/endecode";
import { cn, getSpecifiedColor } from "@/lib/utils";
import { TeamRequestDTO } from "@/types/team-requests";

interface TeamRequestsStatusViewProps {
  requests: TeamRequestDTO[];
}

const TeamRequestsStatusView = ({ requests }: TeamRequestsStatusViewProps) => {
  const [selectedRequest, setSelectedRequest] = useState<TeamRequestDTO | null>(
    null,
  );

  const openSheet = (request: TeamRequestDTO) => {
    setSelectedRequest(request);
  };

  const closeSheet = () => {
    setSelectedRequest(null);
  };

  const getRequestStatusDetails = (request: TeamRequestDTO) => {
    const currentDate = new Date();
    const estimatedCompletionDate = request.estimatedCompletionDate
      ? new Date(request.estimatedCompletionDate)
      : null;

    if (request.isCompleted) {
      return {
        icon: <CheckCircle className="text-green-600 w-5 h-5" />,
        text: "Completed",
        variant: "success",
      };
    }

    if (estimatedCompletionDate && estimatedCompletionDate < currentDate) {
      return {
        icon: <AlertTriangle className="text-red-600 w-5 h-5" />,
        text: "Overdue",
        variant: "destructive",
      };
    }

    return {
      icon: <Clock className="text-blue-600 w-5 h-5" />,
      text: "In Progress",
      variant: "default",
    };
  };

  return (
    <div className="space-y-4">
      {requests.length === 0 ? (
        <Alert variant="default">
          <AlertTitle>No Requests Found</AlertTitle>
          <AlertDescription>
            There are currently no requests available. Please check again later
            or adjust your search criteria.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            const workflowColor = getSpecifiedColor(
              request.workflowRequestName!,
            );
            const statusDetails = getRequestStatusDetails(request);

            return (
              <div
                className={cn(
                  "relative rounded-lg shadow-sm overflow-hidden",
                  "border border-gray-300 dark:border-gray-700", // Extracted border style
                  "bg-white dark:bg-gray-900", // Kept existing background
                  "hover:shadow-md transition-all duration-300",
                  request.isCompleted ? "opacity-70" : "",
                )}
              >
                <div className="p-4 grid grid-cols-[auto,1fr] gap-4">
                  {/* Status Indicator with Tooltip */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="mt-1">{statusDetails.icon}</div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{statusDetails.text}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Content Section */}
                  <div>
                    {/* Title and Workflow */}
                    <div className="flex items-center gap-2 mb-3">
                      <Button
                        variant="link"
                        className={`text-xl text-left p-0 group ${
                          request.isCompleted ? "line-through" : ""
                        }`}
                        onClick={() => openSheet(request)}
                        tabIndex={0}
                        role="button"
                        aria-label={`Open details for ${request.requestTitle}`}
                      >
                        <Badge
                          style={{
                            backgroundColor: workflowColor.background,
                            color: workflowColor.text,
                          }}
                          className="mr-2 no-underline"
                        >
                          {request.workflowRequestName}
                        </Badge>
                        <span className="hover:no-underline">
                          {request.requestTitle}
                        </span>
                      </Button>

                      {/* Priority */}
                      <PriorityDisplay priority={request.priority} />
                    </div>

                    {/* Conversation Health */}
                    {request.conversationHealth?.healthLevel && (
                      <div className="mb-3">
                        <TeamRequestHealthLevel
                          currentLevel={request.conversationHealth.healthLevel}
                        />
                      </div>
                    )}

                    {/* Description */}
                    <div className="mb-3">
                      <div className="text-sm font-medium text-gray-600 mb-1">
                        Description
                      </div>
                      <TruncatedHtmlLabel
                        htmlContent={request.requestDescription!}
                        wordLimit={200}
                      />
                    </div>

                    {/* Detailed Metadata Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {/* Requester */}
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">
                          Requested By
                        </div>
                        <div className="flex items-center gap-2">
                          <UserAvatar
                            imageUrl={request.requestUserImageUrl}
                            size="w-6 h-6"
                          />
                          <Link
                            href={`/portal/users/${obfuscate(request.requestUserId)}`}
                            className="text-sm hover:underline"
                          >
                            {request.requestUserName}
                          </Link>
                        </div>
                      </div>

                      {/* Assigned User */}
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">
                          Assigned To
                        </div>
                        <div className="flex items-center gap-2">
                          {request.assignUserId ? (
                            <>
                              <UserAvatar
                                imageUrl={request.assignUserImageUrl}
                                size="w-6 h-6"
                              />
                              <Link
                                href={`/portal/users/${obfuscate(request.assignUserId)}`}
                                className="text-sm hover:underline"
                              >
                                {request.assignUserName}
                              </Link>
                            </>
                          ) : (
                            <span className="text-sm text-gray-500">
                              Unassigned
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Channel */}
                      {request.channel && (
                        <div>
                          <div className="text-xs font-medium text-gray-500 mb-1">
                            Channel
                          </div>
                          <Badge variant="outline">{request.channel}</Badge>
                        </div>
                      )}

                      {/* Due Date */}
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">
                          Target Completion
                        </div>
                        <div className="text-sm">
                          {request.estimatedCompletionDate
                            ? new Date(
                                request.estimatedCompletionDate,
                              ).toLocaleDateString()
                            : "No due date"}
                        </div>
                      </div>

                      {/* State */}
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">
                          Current State
                        </div>
                        <Badge variant="outline">
                          {request.currentStateName}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Detail Sheet */}
          {selectedRequest && (
            <TeamRequestDetailSheet
              open={!!selectedRequest}
              onClose={closeSheet}
              request={selectedRequest}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default TeamRequestsStatusView;
