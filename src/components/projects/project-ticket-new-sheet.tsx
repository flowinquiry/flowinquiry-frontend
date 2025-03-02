"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import RichTextEditor from "@/components/shared/rich-text-editor";
import { TeamRequestPrioritySelect } from "@/components/teams/team-requests-priority-select";
import TicketChannelSelectField from "@/components/teams/team-ticket-channel-select";
import TeamUserSelectField from "@/components/teams/team-users-select";
import {
  DatePickerField,
  ExtInputField,
  SubmitButton,
} from "@/components/ui/ext-form";
import { FileUploader } from "@/components/ui/file-uploader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import WorkflowStateSelect from "@/components/workflows/workflow-state-select";
import { uploadAttachmentsForEntity } from "@/lib/actions/entity-attachments.action";
import { createTeamRequest } from "@/lib/actions/teams-request.action";
import { useError } from "@/providers/error-provider";
import {
  TeamRequestDTO,
  TeamRequestDTOSchema,
  TeamRequestPriority,
} from "@/types/team-requests";

// ✅ Define TaskBoard type explicitly
export type TaskBoard = Record<string, TeamRequestDTO[]>;

const TaskSheet = ({
  isOpen,
  setIsOpen,
  selectedColumn,
  setTasks,
  projectWorkflowId,
  teamId,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedColumn: string | null;
  setTasks: React.Dispatch<React.SetStateAction<TaskBoard>>;
  projectWorkflowId: number;
  teamId: number;
}) => {
  const { setError } = useError();
  const { data: session } = useSession();
  const [files, setFiles] = useState<File[]>([]);

  // ✅ Initialize Form
  const form = useForm({
    resolver: zodResolver(TeamRequestDTOSchema),
    defaultValues: {
      requestTitle: "",
      requestDescription: "",
      priority: "Medium" as TeamRequestPriority,
      requestUserId: Number(session?.user?.id ?? 0),
      assignUserId: null,
      teamId: teamId,
      workflowId: projectWorkflowId,
      estimatedCompletionDate: null,
      actualCompletionDate: null,
    },
  });

  // ✅ Ensure workflowId updates when projectWorkflowId changes
  useEffect(() => {
    form.reset({
      ...form.getValues(),
      requestTitle: "",
      requestDescription: "",
      priority: "Medium" as TeamRequestPriority,
      requestUserId: Number(session?.user?.id ?? 0),
      assignUserId: null,
      teamId: teamId,
      workflowId: projectWorkflowId,
      estimatedCompletionDate: null,
      actualCompletionDate: null,
    });
  }, [projectWorkflowId, teamId, session]);

  // ✅ Handle Form Submission
  const onSubmit = async (data: TeamRequestDTO) => {
    if (!selectedColumn) return;

    const newTask = await createTeamRequest(data, setError);
    if (newTask?.id && files.length > 0) {
      await uploadAttachmentsForEntity("Team_Request", newTask.id, files);
    }

    // ✅ Update Tasks State
    setTasks((prev) => ({
      ...prev,
      [selectedColumn]: [...(prev[selectedColumn] || []), newTask],
    }));

    // Reset Form & Close Sheet
    form.reset();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="w-[56rem] max-w-[64rem]">
        <SheetHeader>
          <SheetTitle>Add New Task</SheetTitle>
        </SheetHeader>

        {/* ✅ Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1"
          >
            <div className="flex-1 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* ✅ Title Field */}
                <div className="col-span-1 sm:col-span-2">
                  <ExtInputField
                    form={form}
                    fieldName="requestTitle"
                    label="Title"
                    required
                  />
                </div>

                {/* ✅ Description Field */}
                <div className="col-span-1 sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="requestDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Description{" "}
                          <span className="text-destructive">*</span>
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

                {/* ✅ File Uploader */}
                <div className="col-span-1 sm:col-span-2">
                  <FileUploader
                    maxFileCount={8}
                    maxSize={8 * 1024 * 1024}
                    accept={{ "*/*": [] }}
                    onValueChange={setFiles}
                  />
                </div>

                {/* ✅ Priority Select */}
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

                {/* ✅ Assignee Select */}
                <TeamUserSelectField
                  form={form}
                  fieldName="assignUserId"
                  label="Assignee"
                  teamId={teamId}
                />

                {/* ✅ Estimated Completion Date */}
                <DatePickerField
                  form={form}
                  fieldName="estimatedCompletionDate"
                  label="Target Completion Date"
                  placeholder="Select a date"
                />

                {/* ✅ Actual Completion Date */}
                <DatePickerField
                  form={form}
                  fieldName="actualCompletionDate"
                  label="Actual Completion Date"
                  placeholder="Select a date"
                />

                {/* ✅ Ticket Channel Select */}
                <TicketChannelSelectField form={form} />

                {/* ✅ Workflow State Select */}
                <WorkflowStateSelect
                  form={form}
                  name="currentStateId"
                  label="State"
                  required
                  workflowId={projectWorkflowId}
                  includeSelf
                />
              </div>
            </div>

            {/* ✅ Submit Button */}
            <div className="pt-4">
              <SubmitButton label="Save" labelWhileLoading="Saving ..." />
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default TaskSheet;
