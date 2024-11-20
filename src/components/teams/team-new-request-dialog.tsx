import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExtInputField } from "@/components/ui/ext-form";
import { Form } from "@/components/ui/form";
import { TeamRequestDTOSchema, TeamRequestType, TeamType } from "@/types/teams";

type NewRequestToTeamDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  teamEntity: TeamType;
  onSaveSuccess: () => void;
};

const NewRequestToTeamDialog: React.FC<NewRequestToTeamDialogProps> = ({
  open,
  setOpen,
  teamEntity,
  onSaveSuccess,
}) => {
  const form = useForm<z.infer<typeof TeamRequestDTOSchema>>({
    resolver: zodResolver(TeamRequestDTOSchema),
  });

  const onSubmit = (data: TeamRequestType) => {
    console.log(`Submit team request ${JSON.stringify(data)}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[56rem]">
        <DialogHeader>
          <DialogTitle>Create a New Ticket Request</DialogTitle>
          <DialogDescription>
            Submit a request to the team to get assistance or initiate a task.
            Provide all necessary details to help the team understand and
            address your request effectively
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ExtInputField
              form={form}
              fieldName="requestTitle"
              label="Title"
              required={true}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewRequestToTeamDialog;
