"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

import { Heading } from "@/components/heading";
import RichTextEditor from "@/components/shared/rich-text-editor";
import { TeamRequestPrioritySelect } from "@/components/teams/team-requests-priority-select";
import TicketChannelSelectField from "@/components/teams/team-ticket-channel-select";
import TeamUserSelectField from "@/components/teams/team-users-select";
import { Button } from "@/components/ui/button";
import {
  DatePickerField,
  ExtInputField,
  FormProps,
  SubmitButton,
} from "@/components/ui/ext-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import WorkflowStateSelect from "@/components/workflows/workflow-state-select";
import { updateTeamRequest } from "@/lib/actions/teams-request.action";
import { obfuscate } from "@/lib/endecode";
import { randomPair } from "@/lib/utils";
import { validateForm } from "@/lib/validator";
import {
  TeamRequestDTO,
  TeamRequestDTOSchema,
  TeamRequestPriority,
} from "@/types/team-requests";

export const TeamRequestForm = ({
  initialData: teamRequest,
}: FormProps<TeamRequestDTO>) => {
  const router = useRouter();

  const form = useForm<TeamRequestDTO>({
    resolver: zodResolver(TeamRequestDTOSchema),
    defaultValues: teamRequest,
  });

  async function onSubmit(teamRequest: TeamRequestDTO) {
    if (validateForm(teamRequest, TeamRequestDTOSchema, form)) {
      await updateTeamRequest(teamRequest.id!, teamRequest);
      router.push(
        `/portal/teams/${obfuscate(teamRequest.teamId)}/requests/${obfuscate(teamRequest.id)}?${randomPair()}`,
      );
    }
  }

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-4">
        <Heading
          title={`${teamRequest?.workflowRequestName}: Edit Ticket`}
          description="Edit the details of your ticket"
        />
      </div>

      {/* Form */}
      <Form {...form}>
        <form
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-[72rem] mx-auto"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* Title Field - Spans 2 Columns */}
          <div className="col-span-1 sm:col-span-2">
            <ExtInputField
              form={form}
              fieldName="requestTitle"
              label="Title"
              required={true}
            />
          </div>

          <div className="col-span-1 sm:col-span-2">
            <FormField
              control={form.control}
              name="requestDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description <span className="text-destructive"> *</span>
                  </FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <TeamUserSelectField
            form={form}
            fieldName="assignUserId"
            label="Assignee"
            teamId={teamRequest?.teamId!}
          />

          {/* Priority Field - Single Column */}
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <TeamRequestPrioritySelect
                    value={field.value}
                    onChange={(value: TeamRequestPriority) =>
                      field.onChange(value)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DatePickerField
            form={form}
            fieldName="estimatedCompletionDate"
            label="Target Completion Date"
            placeholder="Select a date"
          />

          <DatePickerField
            form={form}
            fieldName="actualCompletionDate"
            label="Actual Completion Date"
            placeholder="Select a date"
          />

          <TicketChannelSelectField form={form} />
          <WorkflowStateSelect
            form={form}
            name="currentStateId"
            label="State"
            required={true}
            workflowId={teamRequest?.workflowId!}
            workflowStateId={teamRequest?.currentStateId!}
            includeSelf={true}
          />

          <div className="col-span-1 sm:col-span-2 flex flex-row gap-4">
            <SubmitButton
              label="Save changes"
              labelWhileLoading="Saving changes..."
            />
            <Button variant="secondary" onClick={() => router.back()}>
              Discard
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
