import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import TeamUserSelectField from "@/components/teams/team-users-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExtInputField, SubmitButton } from "@/components/ui/ext-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import WorkflowSelectField from "@/components/workflows/workflow-select";
import { createTeamRequest } from "@/lib/actions/teams-request.action";
import { TeamDTO, TeamRequestDTO, TeamRequestDTOSchema } from "@/types/teams";
import RichTextEditor from "@/components/shared/rich-text-editor";

type NewRequestToTeamDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  teamEntity: TeamDTO;
  onSaveSuccess: () => void;
};

const NewRequestToTeamDialog: React.FC<NewRequestToTeamDialogProps> = ({
  open,
  setOpen,
  teamEntity,
  onSaveSuccess,
}) => {
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof TeamRequestDTOSchema>>({
    resolver: zodResolver(TeamRequestDTOSchema),
    defaultValues: {
      teamId: teamEntity.id,
      requestUserId: Number(session?.user?.id!),
    },
  });

  const onSubmit = async (data: TeamRequestDTO) => {
    await createTeamRequest(data);
    setOpen(false);
    onSaveSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[56rem] max-h-[90vh] p-4 sm:p-6 flex flex-col">
        {/* Header: Title and Description */}
        <div>
          <DialogHeader>
            <DialogTitle>Create a New Ticket Request</DialogTitle>
            <DialogDescription>
              Submit a request to the team to get assistance or initiate a task.
              Provide all necessary details to help the team understand and
              address your request effectively.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1"
          >
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto space-y-6">
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
                teamId={teamEntity.id!}
              />
              <WorkflowSelectField
                form={form}
                fieldName="workflowId"
                label="Workflow"
                teamId={teamEntity.id!}
              />
            </div>

            {/* Footer: Submit Button */}
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
