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
import { useError } from "@/providers/error-provider";
import { WorkflowStateDTO } from "@/types/workflows";

type WorkflowStateSelectProps = {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  workflowId: number;
  workflowStateId: number;
  includeSelf?: boolean;
  required?: boolean;
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
  const { setError } = useError();

  useEffect(() => {
    const loadWorkflowStates = async () => {
      setIsLoading(true);
      try {
        const data = await getValidTargetStates(
          workflowId,
          workflowStateId,
          includeSelf,
          setError,
        );
        setWorkflowStates(data);

        // Set the initial value if field value matches one of the loaded states
        if (!form.getValues(name) && data.length > 0) {
          const initialState = data.find(
            (state) => state.id === workflowStateId,
          );

          if (initialState) {
            form.setValue(name, initialState.id, { shouldValidate: true });
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (workflowId) {
      loadWorkflowStates();
    }
  }, [workflowId, workflowStateId, includeSelf, form, name, setError]);

  // Derive the selected state's name for display in the placeholder
  const selectedStateName =
    workflowStates.find((state) => state.id === form.getValues(name))
      ?.stateName || "Select a state";

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
              // Convert the integer field value to a string for Select
              value={field.value != null ? String(field.value) : undefined}
              // Convert the selected string value back to an integer
              onValueChange={(value) =>
                field.onChange(value ? Number(value) : null)
              }
              disabled={isLoading || workflowStates.length === 0}
            >
              <SelectTrigger className={cn("w-[16rem]")}>
                <SelectValue placeholder={selectedStateName} />
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
