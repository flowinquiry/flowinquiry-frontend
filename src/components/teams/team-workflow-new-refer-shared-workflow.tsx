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
  createWorkflowFromCloning,
  createWorkflowFromReference,
  getGlobalWorkflowHasNotLinkedWithTeam,
} from "@/lib/actions/workflows.action";
import { obfuscate } from "@/lib/endecode";
import { WorkflowDTO } from "@/types/workflows";
import { useError } from "@/providers/error-provider";

const workflowReferenceSchema = z.object({
  referenceWorkflowId: z
    .number()
    .positive("You must select a global workflow."),
  name: z.string().min(1, "Workflow name is required."),
  requestName: z.string().min(1, "Ticket type is required"),
  description: z.string().optional(),
});

type WorkflowReferenceFormValues = z.infer<typeof workflowReferenceSchema>;

// isRefer is true if we create a new workflow refer from an existing one, otherwise we create a new workflow by cloning an existing one
const NewTeamWorkflowReferFromSharedOne = ({
  teamId,
  isRefer,
}: {
  teamId: number;
  isRefer: boolean;
}) => {
  const router = useRouter();
  const [globalWorkflows, setGlobalWorkflows] = useState<WorkflowDTO[]>([]);
  const { setError } = useError();

  useEffect(() => {
    async function loadGlobalWorkflowsNotLinkWithTeamYet() {
      getGlobalWorkflowHasNotLinkedWithTeam(teamId, setError).then((data) =>
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
    if (isRefer) {
      createWorkflowFromReference(
        teamId,
        values.referenceWorkflowId,
        {
          name: values.name,
          requestName: values.requestName,
          description: values.description,
          ownerId: teamId,
        },
        setError,
      ).then((data) => {
        router.push(
          `/portal/teams/${obfuscate(teamId)}/workflows/${obfuscate(data.id)}`,
        );
      });
    } else {
      createWorkflowFromCloning(
        teamId,
        values.referenceWorkflowId,
        {
          name: values.name,
          requestName: values.requestName,
          description: values.description,
          ownerId: teamId,
        },
        setError,
      ).then((data) => {
        router.push(
          `/portal/teams/${obfuscate(teamId)}/workflows/${obfuscate(data.id)}`,
        );
      });
    }
  };

  return (
    <div className="p-6 border rounded-lg">
      <h2 className="text-lg font-bold mb-4">
        {isRefer
          ? "Create Workflow from Reference"
          : "Create Workflow by cloning"}
      </h2>
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
                    }
                    value={field.value?.toString()}
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

          {/* Two-column layout for name and requestName */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              label="Ticket Type"
              placeholder="Enter ticket type"
              required
            />
          </div>

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

export default NewTeamWorkflowReferFromSharedOne;
