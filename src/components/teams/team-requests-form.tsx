"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { notFound, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Heading } from "@/components/heading";
import RichTextEditor from "@/components/shared/rich-text-editor";
import { TeamRequestPrioritySelect } from "@/components/teams/team-requests-priority-select";
import TicketChannelSelectField from "@/components/teams/team-ticket-channel-select";
import TeamUserSelectField from "@/components/teams/team-users-select";
import { Button } from "@/components/ui/button";
import {
  DatePickerField,
  ExtInputField,
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
import { Spinner } from "@/components/ui/spinner";
import WorkflowStateSelect from "@/components/workflows/workflow-state-select";
import {
  findRequestById,
  updateTeamRequest,
} from "@/lib/actions/teams-request.action";
import { obfuscate } from "@/lib/endecode";
import { randomPair } from "@/lib/utils";
import { validateForm } from "@/lib/validator";
import {
  TeamRequestDTO,
  TeamRequestDTOSchema,
  TeamRequestPriority,
} from "@/types/team-requests";

export const TeamRequestForm = ({
  teamRequestId,
}: {
  teamRequestId: number;
}) => {
  const router = useRouter();

  const [teamRequest, setTeamRequest] = useState<TeamRequestDTO | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parse empty object to get schema defaults
  const defaultValues = TeamRequestDTOSchema.parse({});

  const form = useForm<TeamRequestDTO>({
    resolver: zodResolver(TeamRequestDTOSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    const fetchTeamRequest = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await findRequestById(teamRequestId);
        console.log(`Team request ${JSON.stringify(data)}`);
        setTeamRequest(data);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamRequest();
  }, [teamRequestId]);

  useEffect(() => {
    if (teamRequest) {
      form.reset(teamRequest);
    } else {
      form.reset(defaultValues);
    }
  }, [teamRequest]);

  async function onSubmit(formValues: TeamRequestDTO) {
    if (validateForm(formValues, TeamRequestDTOSchema, form)) {
      await updateTeamRequest(formValues.id!, formValues);
      router.push(
        `/portal/teams/${obfuscate(formValues.teamId)}/requests/${obfuscate(
          formValues.id,
        )}?${randomPair()}`,
      );
    }
  }

  if (loading) {
    return (
      <div className="py-4 flex justify-center items-center">
        <Spinner>Loading data...</Spinner>
      </div>
    );
  }

  if (error || !teamRequest) {
    notFound();
  }

  const breadcrumbItems = [
    { title: "Dashboard", link: "/portal" },
    { title: "Teams", link: "/portal/teams" },
    {
      title: teamRequest.teamName!,
      link: `/portal/teams/${obfuscate(teamRequest.teamId!)}`,
    },
    {
      title: "Requests",
      link: `/portal/teams/${obfuscate(teamRequest.teamId!)}/requests`,
    },
    {
      title: teamRequest.requestTitle!,
      link: `/portal/teams/${obfuscate(teamRequest.teamId!)}/requests/${obfuscate(teamRequest.id!)}`,
    },
    { title: "Edit", link: "#" },
  ];

  return (
    <div className="py-4">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="flex items-center justify-between mb-4">
        <Heading
          title={`${teamRequest?.workflowRequestName}: Edit Ticket`}
          description="Edit the details of your ticket"
        />
      </div>

      <Form {...form}>
        <form
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-[72rem] mx-auto"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="col-span-1 sm:col-span-2">
            <ExtInputField
              form={form}
              fieldName="requestTitle"
              label="Title"
              required
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
            teamId={teamRequest.teamId!}
          />

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
            required
            workflowId={teamRequest.workflowId!}
            workflowStateId={teamRequest.currentStateId!}
            includeSelf
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
