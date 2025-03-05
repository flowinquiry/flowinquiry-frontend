"use client";

import React, { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getValidTargetStates } from "@/lib/actions/workflows.action";
import { useError } from "@/providers/error-provider";
import { WorkflowStateDTO } from "@/types/workflows";

type WorkflowStateSelectProps = {
  workflowId: number;
  currentStateId?: number;
  onChange: (stateId: number, stateName: string) => void;
  disabled?: boolean;
};

/**
 * A component for selecting workflow states
 *
 * This component loads the valid target states for a workflow and state,
 * and provides a select dropdown to choose a new state.
 */
const WorkflowStateSelect: React.FC<WorkflowStateSelectProps> = ({
  workflowId,
  currentStateId,
  onChange,
  disabled = false,
}) => {
  const [workflowStates, setWorkflowStates] = useState<WorkflowStateDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setError } = useError();

  useEffect(() => {
    const loadWorkflowStates = async () => {
      setIsLoading(true);
      try {
        if (workflowId && currentStateId) {
          const data = await getValidTargetStates(
            workflowId,
            currentStateId,
            true, // includeSelf
            setError,
          );
          setWorkflowStates(data);
        }
      } catch (error) {
        console.error("Failed to load workflow states:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkflowStates();
  }, [workflowId, currentStateId, setError]);

  const selectedState = workflowStates.find(
    (state) => state.id === currentStateId,
  );

  const handleStateChange = (value: string) => {
    const stateId = Number(value);
    const newState = workflowStates.find((state) => state.id === stateId);

    if (newState) {
      // Pass both the ID and the name to the parent component
      onChange(stateId, newState.stateName);
    }
  };

  return (
    <Select
      value={currentStateId ? String(currentStateId) : ""}
      onValueChange={handleStateChange}
      disabled={disabled || isLoading || workflowStates.length === 0}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a state">
          {selectedState?.stateName || "Loading states..."}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {workflowStates.map((state) => (
          <SelectItem key={state.id} value={String(state.id!)}>
            {state.stateName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default WorkflowStateSelect;
