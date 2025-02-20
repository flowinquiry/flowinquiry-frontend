"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import RichTextEditor from "@/components/shared/rich-text-editor";
import { TeamRequestPrioritySelect } from "@/components/teams/team-requests-priority-select";
import TicketChannelSelectField from "@/components/teams/team-ticket-channel-select";
import TeamUserSelectField from "@/components/teams/team-users-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { uploadAttachmentsForEntity } from "@/lib/actions/entity-attachments.action";
import { createTeamRequest } from "@/lib/actions/teams-request.action";
import { useError } from "@/providers/error-provider";
import {
  TeamRequestDTO,
  TeamRequestDTOSchema,
  TeamRequestPriority,
} from "@/types/team-requests";
import { TeamDTO } from "@/types/teams";
import { WorkflowDTO } from "@/types/workflows";

type NewRequestToTeamDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  teamEntity: TeamDTO;
  workflow: WorkflowDTO | null;
  onSaveSuccess: () => void;
};

const NewRequestToTeamDialog: React.FC<NewRequestToTeamDialogProps> = ({
  open,
  setOpen,
  teamEntity,
  workflow,
  onSaveSuccess,
}) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const { data: session } = useSession();
  const { setError } = useError();

  const form = useForm<z.infer<typeof TeamRequestDTOSchema>>({
    resolver: zodResolver(TeamRequestDTOSchema),
    defaultValues: {
      teamId: teamEntity.id!,
      priority: "Medium",
      workflowId: workflow?.id !== undefined ? workflow.id : undefined,
      requestUserId: Number(session?.user?.id ?? 0),
      requestTitle: "",
      requestDescription: "",
      assignUserId: undefined,
      estimatedCompletionDate: null,
      actualCompletionDate: null,
    },
  });

  /** ✅ Reset form values when the dialog opens with a new workflow */
  useEffect(() => {
    if (open) {
      form.reset({
        teamId: teamEntity.id!,
        priority: "Medium",
        workflowId: workflow?.id !== undefined ? workflow.id : undefined,
        requestUserId: Number(session?.user?.id ?? 0),
        requestTitle: "",
        requestDescription: "",
        assignUserId: undefined,
        estimatedCompletionDate: null,
        actualCompletionDate: null,
      });
      setFiles([]); // Reset file state
    }
  }, [open, workflow, form, teamEntity.id, session]);

  const onSubmit = async (data: TeamRequestDTO) => {
    const savedTeamRequest = await createTeamRequest(data, setError);
    if (savedTeamRequest?.id && files.length > 0) {
      uploadAttachmentsForEntity("Team_Request", savedTeamRequest.id, files);
    }
    setOpen(false);
    onSaveSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[56rem] max-h-[90vh] p-4 sm:p-6 flex flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            [{workflow?.requestName}]: Create a New Ticket Request
          </DialogTitle>
          <DialogDescription>
            Submit a request to the team to get assistance or initiate a task.
            Provide all necessary details to help the team understand and
            address your request effectively.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1"
          >
            <div className="flex-1 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                          Description{" "}
                          <span className="text-destructive"> *</span>
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

                <div className="col-span-1 sm:col-span-2">
                  <FileUploader
                    maxFileCount={8}
                    maxSize={8 * 1024 * 1024}
                    accept={{ "*/*": [] }}
                    onValueChange={setFiles}
                  />
                </div>

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

                <TeamUserSelectField
                  form={form}
                  fieldName="assignUserId"
                  label="Assignee"
                  teamId={teamEntity.id!}
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
              </div>
            </div>

            <div className="pt-4">
              <SubmitButton label="Save" labelWhileLoading="Saving ..." />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewRequestToTeamDialog;
