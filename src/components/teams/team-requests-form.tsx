"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

import { Heading } from "@/components/heading";
import RichTextEditor from "@/components/shared/rich-text-editor";
import { TeamRequestPrioritySelect } from "@/components/teams/team-requests-priority-select";
import TeamUserSelectField from "@/components/teams/team-users-select";
import { Button } from "@/components/ui/button";
import {
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
import { Separator } from "@/components/ui/separator";
import { validateForm } from "@/lib/validator";
import {
  TeamRequestDTO,
  TeamRequestDTOSchema,
  TeamRequestPriority,
} from "@/types/teams";

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
      console.log(`Update team request ${JSON.stringify(teamRequest)}`);
    }
  }

  return (
    <div className="py-4 grid grid-cols-1 gap-4">
      <div className="flex items-center justify-between">
        <Heading title={"Edit request"} description="Edit request" />
      </div>
      <Separator />
      <Form {...form}>
        <form
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-[72rem]"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <ExtInputField
            form={form}
            fieldName="requestTitle"
            label="Title"
            required={true}
          />
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
          <TeamUserSelectField
            form={form}
            fieldName="assignUserId"
            label="Assignee"
            teamId={teamRequest?.id!}
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
          <div className="md:col-span-2 flex flex-row gap-4">
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
