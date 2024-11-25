"use client";

import Link from "next/link";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { UserAvatar } from "@/components/shared/avatar-display";
import CommentsView from "@/components/shared/comments-view";
import TeamUserSelectField from "@/components/teams/team-users-select";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { updateTeamRequest } from "@/lib/actions/teams-request.action";
import { obfuscate } from "@/lib/endecode";
import { TeamRequestDTO } from "@/types/teams";

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
        <SheetContent className="w-full sm:w-[50rem] h-full">
          <ScrollArea className="h-full">
            <SheetHeader>
              <SheetTitle>
                <Button variant="link" className="px-0 text-2xl">
                  <Link
                    href={`/portal/teams/${obfuscate(teamRequest.teamId)}/requests/${obfuscate(teamRequest.id)}`}
                  >
                    {teamRequest.requestTitle}
                  </Link>
                </Button>
              </SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2 pt-4">
                <label className="text-sm font-medium">Description</label>
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: teamRequest.requestDescription!,
                  }}
                />
              </div>

              {/* Second Row: Requested User */}
              <div className="flex flex-col space-y-2 pt-4">
                <label className="text-sm font-medium">Requested User</label>
                {teamRequest.requestUserId !== null && (
                  <div className="flex items-center gap-2">
                    <UserAvatar imageUrl={teamRequest.requestUserImageUrl} />
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
                )}
              </div>

              {/* Second Row: Assignee */}
              <div>
                <form>
                  <div className="grid gap-4 py-4">
                    <div>
                      <TeamUserSelectField
                        form={form}
                        fieldName="assignUserId"
                        label="Assigned User"
                        teamId={teamRequest.teamId!}
                        onUserSelect={(user) => form.handleSubmit(onSubmit)()}
                      />
                    </div>
                  </div>
                </form>
              </div>
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
