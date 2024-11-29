"use client";

import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getValidTargetStates } from "@/lib/actions/workflows.action";
import { cn } from "@/lib/utils";
import { WorkflowStateDTO } from "@/types/workflows";

type WorkflowStateSelectProps = {
  form: UseFormReturn<any>; // React Hook Form instance passed as prop
  name: string; // Form field name
  label?: string; // Label for the select
  workflowId: number; // Workflow ID to fetch states for
  workflowStateId: number; // Workflow state ID to fetch the next states from the current workflowStateId
  includeSelf?: boolean; // include the self state
  required?: boolean; // Whether the field is required
};

const WorkflowStateSelect = ({
  form,
  name,
  label = "Select Workflow State",
  workflowId,
  workflowStateId,
  includeSelf = false,
  required = false,
}: WorkflowStateSelectProps) => {
  const [workflowStates, setWorkflowStates] = useState<WorkflowStateDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch workflow states
  useEffect(() => {
    const loadWorkflowStates = async () => {
      setIsLoading(true);
      getValidTargetStates(workflowId, workflowStateId, includeSelf)
        .then((data) => setWorkflowStates(data))
        .finally(() => setIsLoading(false));
    };

    if (workflowId) {
      loadWorkflowStates();
    }
  }, [workflowId, workflowStateId]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-destructive"> *</span>}
          </FormLabel>
          <FormControl>
            <Select
              value={field.value != null ? String(field.value) : undefined} // Convert number to string for Select
              onValueChange={(value) =>
                field.onChange(value ? Number(value) : null)
              } // Convert string back to number
              disabled={isLoading || workflowStates.length === 0}
            >
              <SelectTrigger className={cn("w-[16rem]")}>
                <SelectValue
                  placeholder={isLoading ? "Loading..." : "Select a state"}
                />
              </SelectTrigger>
              <SelectContent>
                {workflowStates.map((state) => (
                  <SelectItem key={state.id} value={String(state.id)}>
                    {state.stateName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default WorkflowStateSelect;
