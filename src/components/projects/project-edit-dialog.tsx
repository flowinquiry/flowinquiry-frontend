"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import RichTextEditor from "@/components/shared/rich-text-editor";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createProject, updateProject } from "@/lib/actions/project.action";
import { useError } from "@/providers/error-provider";
import { ProjectDTO, ProjectSchema } from "@/types/projects";
import { TeamDTO } from "@/types/teams";

type ProjectDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  teamEntity: TeamDTO;
  project?: ProjectDTO | null;
  onSaveSuccess: () => void;
};

const ProjectEditDialog: React.FC<ProjectDialogProps> = ({
  open,
  setOpen,
  teamEntity,
  project,
  onSaveSuccess,
}) => {
  const { setError } = useError();

  const form = useForm<z.infer<typeof ProjectSchema>>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      teamId: teamEntity.id!,
      name: "",
      description: "",
      status: "Active",
      startDate: null,
      endDate: null,
    },
  });

  // Populate form when editing an existing project
  useEffect(() => {
    if (project) {
      form.reset({
        teamId: teamEntity.id!,
        name: project.name || "",
        description: project.description || "",
        status: project.status || "Active",
        startDate: project.startDate || null,
        endDate: project.endDate || null,
      });
    } else {
      form.reset({
        teamId: teamEntity.id!,
        name: "",
        description: "",
        status: "Active",
        startDate: null,
        endDate: null,
      });
    }
  }, [project, teamEntity.id, open]);

  const onSubmit = async (data: ProjectDTO) => {
    if (project) {
      await updateProject(project.id!, data, setError);
    } else {
      await createProject(data, setError);
    }

    setOpen(false);
    onSaveSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[56rem] max-h-[90vh] p-4 sm:p-6 flex flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "New Project"}</DialogTitle>
          <DialogDescription>
            {project
              ? "Modify the project details."
              : "Every great project starts with a first step. Let's begin!"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1"
          >
            <div className="flex-1 overflow-y-auto space-y-6">
              {/* Grid layout for form fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name Field - Spans full width */}
                <div className="col-span-1 sm:col-span-2">
                  <ExtInputField
                    form={form}
                    fieldName="name"
                    label="Name"
                    required
                  />
                </div>

                {/* Description Field - Spans full width */}
                <div className="col-span-1 sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
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
                            key={`editor-${Date.now()}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Start Date in first column, End Date in second column */}
                <div className="col-span-1">
                  <DatePickerField
                    form={form}
                    fieldName="startDate"
                    label="Start Date"
                    placeholder="Select a date"
                  />
                </div>
                <div className="col-span-1">
                  <DatePickerField
                    form={form}
                    fieldName="endDate"
                    label="End Date"
                    placeholder="Select a date"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <SubmitButton
                label={project ? "Save Changes" : "Save"}
                labelWhileLoading="Saving ..."
              />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectEditDialog;
