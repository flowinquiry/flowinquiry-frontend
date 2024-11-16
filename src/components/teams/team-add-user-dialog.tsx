"use client";

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
import { SubmitButton } from "@/components/ui/ext-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import MultipleSelector from "@/components/ui/multi-select-dynamic";
import { addUsersToTeam, findUsersNotInTeam } from "@/lib/actions/teams.action";
import { TeamType } from "@/types/teams";

type AddUserToTeamDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  teamEntity: TeamType;
  onSaveSuccess: () => void;
};

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

const FormSchema = z.object({
  users: z.array(optionSchema).min(1),
});

const AddUserToTeamDialog: React.FC<AddUserToTeamDialogProps> = ({
  open,
  setOpen,
  teamEntity,
  onSaveSuccess,
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (data && data.users) {
      const userIds = data.users.map((user) => Number(user.value));
      console.log(
        `Save user to team ${JSON.stringify(teamEntity.id)} ${JSON.stringify(userIds)}}`,
      );
      await addUsersToTeam(teamEntity.id!, userIds);
      setOpen(false);
      onSaveSuccess();
    }
  };

  const searchUsers = async (userTerm: string) => {
    const users = await findUsersNotInTeam(userTerm, teamEntity.id!);
    return Promise.all(
      users.map((user) => ({
        value: `${user.id}`,
        label: `${user.firstName} ${user.lastName}`,
      })),
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add user to team {teamEntity.name} </DialogTitle>
          <DialogDescription>
            Add a user to this team by searching for them. Begin typing to see
            suggestions that match your input
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="users"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Users</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      {...field}
                      onSearch={searchUsers}
                      placeholder="Add user to team..."
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                          no results found.
                        </p>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton label="Save" labelWhileLoading="Saving ..." />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserToTeamDialog;
