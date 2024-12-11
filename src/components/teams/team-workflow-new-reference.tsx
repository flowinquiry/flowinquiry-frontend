"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { ExtInputField, ExtTextAreaField } from "@/components/ui/ext-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createWorkflowFromReference,
  getGlobalWorkflowHasNotLinkedWithTeam,
} from "@/lib/actions/workflows.action";
import { WorkflowDTO } from "@/types/workflows";

const workflowReferenceSchema = z.object({
  referenceWorkflowId: z
    .number()
    .positive("You must select a global workflow."),
  name: z.string().min(1, "Workflow name is required."),
  requestName: z.string().min(1, "Ticket type is required"),
  description: z.string().optional(),
});

type WorkflowReferenceFormValues = z.infer<typeof workflowReferenceSchema>;

const NewTeamWorkflowReference = ({ teamId }: { teamId: number }) => {
  const router = useRouter();
  const [globalWorkflows, setGlobalWorkflows] = useState<WorkflowDTO[]>([]);
  useEffect(() => {
    async function loadGlobalWorkflowsNotLinkWithTeamYet() {
      getGlobalWorkflowHasNotLinkedWithTeam(teamId).then((data) =>
        setGlobalWorkflows(data),
      );
    }
    loadGlobalWorkflowsNotLinkWithTeamYet();
  }, [teamId]);

  const form = useForm<WorkflowReferenceFormValues>({
    resolver: zodResolver(workflowReferenceSchema),
    defaultValues: {
      referenceWorkflowId: -1,
      name: "",
      requestName: "",
      description: "",
    },
  });

  const onSubmit = (values: WorkflowReferenceFormValues) => {
    createWorkflowFromReference(teamId, values.referenceWorkflowId, {
      name: values.name,
      requestName: values.requestName,
      description: values.description,
      ownerId: teamId,
    }).then((data) => {
      router.push(`/portal/teams/${teamId}/workflows/${data.id}`);
    });
  };

  return (
    <div className="p-6 border rounded-lg">
      <h2 className="text-lg font-bold mb-4">Create Workflow from Reference</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="referenceWorkflowId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Workflow Reference{" "}
                  <span className="text-destructive"> *</span>
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(parseInt(value, 10))
                    } // Convert string to int
                    value={field.value?.toString()} // Convert int to string
                  >
                    <SelectTrigger className="w-[20rem]">
                      <SelectValue placeholder="Select a workflow" />
                    </SelectTrigger>
                    <SelectContent>
                      {globalWorkflows.map((workflow) => (
                        <SelectItem
                          key={workflow.id!.toString()}
                          value={workflow.id!.toString()}
                        >
                          {workflow.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ExtInputField
            form={form}
            fieldName="name"
            label="Workflow Name"
            placeholder="Enter workflow name"
            required
          />
          <ExtInputField
            form={form}
            fieldName="requestName"
            label="Ticket type"
            placeholder="Enter ticket type"
            required
          />

          <ExtTextAreaField
            form={form}
            fieldName="description"
            label="Description"
            placeholder="Enter workflow description (optional)"
          />

          {/* Submit Button */}
          <Button type="submit">
            <Save /> Create Workflow
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewTeamWorkflowReference;
