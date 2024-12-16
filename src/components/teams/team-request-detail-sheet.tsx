"use client";

import Link from "next/link";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { UserAvatar } from "@/components/shared/avatar-display";
import CommentsView from "@/components/shared/comments-view";
import { NColumnsGrid } from "@/components/shared/n-columns-grid";
import { PriorityDisplay } from "@/components/teams/team-requests-priority-display";
import TeamUserSelectField from "@/components/teams/team-users-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { updateTeamRequest } from "@/lib/actions/teams-request.action";
import { formatDateTimeDistanceToNow } from "@/lib/datetime";
import { obfuscate } from "@/lib/endecode";
import { getSpecifiedColor } from "@/lib/utils";
import { TeamRequestDTO } from "@/types/team-requests";

type RequestDetailsProps = {
  open: boolean;
  onClose: () => void;
  request: TeamRequestDTO;
};

const TeamRequestDetailSheet: React.FC<RequestDetailsProps> = ({
  open,
  onClose,
  request,
}) => {
  const [teamRequest, setTeamRequest] = useState<TeamRequestDTO>(request);
  const workflowColor = getSpecifiedColor(request.workflowRequestName!);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const form = useForm<TeamRequestDTO>({
    defaultValues: teamRequest,
  });

  const onSubmit = async (data: TeamRequestDTO) => {
    setSubmitting(true);
    await updateTeamRequest(teamRequest.id!, data)
      .then((data) => setTeamRequest(data))
      .finally(() => setSubmitting(false));
  };

  return (
    <FormProvider {...form}>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="w-full sm:w-[64rem] h-full">
          <ScrollArea className="h-full px-4">
            <SheetHeader>
              <SheetTitle>
                <div className="w-full flex gap-2 items-start pt-4">
                  <span
                    className=" inline-block px-2 py-1 text-xs font-semibold rounded-md"
                    style={{
                      backgroundColor: workflowColor.background,
                      color: workflowColor.text,
                    }}
                  >
                    {request.workflowRequestName}
                  </span>
                  <Button
                    variant="link"
                    className={`px-0 text-2xl ${request.isCompleted ? "line-through" : ""}`}
                  >
                    <Link
                      href={`/portal/teams/${obfuscate(teamRequest.teamId)}/requests/${obfuscate(
                        teamRequest.id,
                      )}`}
                      className="break-words whitespace-normal text-left"
                    >
                      {teamRequest.requestTitle}
                    </Link>
                  </Button>
                </div>
              </SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
              <div className="col-span-1 md:col-span-2 pt-4">
                <label className="text-sm font-medium">Description</label>
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
                className="col-span-1 md:col-span-2"
                fields={[
                  {
                    label: "Created",
                    value: formatDateTimeDistanceToNow(
                      new Date(request.createdAt!),
                    ),
                    colSpan: 1,
                  },
                  {
                    label: "Modified",
                    value: formatDateTimeDistanceToNow(
                      new Date(request.modifiedAt!),
                    ),
                    colSpan: 1,
                  },

                  {
                    label: "Requested User",
                    value:
                      teamRequest.requestUserId !== null ? (
                        <div className="flex items-center gap-2">
                          <UserAvatar
                            imageUrl={teamRequest.requestUserImageUrl}
                          />
                          <Button
                            variant="link"
                            className="p-0 text-left w-auto h-auto"
                            style={{ display: "block", textAlign: "left" }}
                          >
                            <Link
                              href={`/portal/users/${obfuscate(teamRequest.requestUserId)}`}
                            >
                              {teamRequest.requestUserName}
                            </Link>
                          </Button>
                        </div>
                      ) : (
                        <span>No requested user</span>
                      ),
                    colSpan: 1,
                  },

                  {
                    label: "Assigned User",
                    value: (
                      <form>
                        <div className="grid gap-4">
                          <TeamUserSelectField
                            form={form}
                            fieldName="assignUserId"
                            label=""
                            teamId={teamRequest.teamId!}
                            onUserSelect={(user) =>
                              form.handleSubmit(onSubmit)()
                            }
                          />
                        </div>
                      </form>
                    ),
                    colSpan: 1,
                  },

                  {
                    label: "Type",
                    value: (
                      <Badge variant="outline">
                        {request.workflowRequestName}
                      </Badge>
                    ),
                    colSpan: 1,
                  },
                  {
                    label: "Priority",
                    value: <PriorityDisplay priority={request.priority} />,
                    colSpan: 1,
                  },
                  {
                    label: "State",
                    value: (
                      <Badge variant="outline">
                        {request.currentStateName}
                      </Badge>
                    ),
                    colSpan: 1,
                  },
                  {
                    label: "Channel",
                    value: request.channel && (
                      <Badge variant="outline">{request.channel}</Badge>
                    ),
                    colSpan: 1,
                  },
                  {
                    label: "Target Completion Date",
                    value: request.estimatedCompletionDate
                      ? new Date(request.estimatedCompletionDate).toDateString()
                      : "N/A",
                    colSpan: 1,
                  },
                  {
                    label: "Actual Completion Date",
                    value: request.actualCompletionDate
                      ? new Date(request.actualCompletionDate).toDateString()
                      : "N/A",
                    colSpan: 1,
                  },
                ]}
              />
            </div>

            <CommentsView
              entityType="Team_Request"
              entityId={teamRequest.id!}
            />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </FormProvider>
  );
};

export default TeamRequestDetailSheet;
