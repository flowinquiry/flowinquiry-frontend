"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ExtInputField, ExtTextAreaField } from "@/components/ui/ext-form";
import { Form } from "@/components/ui/form";
import WorkflowStatesSelect from "@/components/workflows/workflow-states-select";
import { WorkflowDetailDTO, WorkflowDetailSchema } from "@/types/workflows";

const WorkflowEditForm = ({
  workflowDetail,
  onCancel,
  onSave,
}: {
  workflowDetail: WorkflowDetailDTO;
  onCancel: () => void;
  onSave: (values: WorkflowDetailDTO) => void;
}) => {
  const form = useForm<WorkflowDetailDTO>({
    resolver: zodResolver(WorkflowDetailSchema),
    defaultValues: {
      ...workflowDetail,
      states: workflowDetail.states.map((state) => ({
        ...state,
        trackingId: state.id, // Use the original `id` for tracking
      })),
    },
  });
  const {
    fields: stateFields,
    append: appendState,
    remove: removeState,
    update: updateState,
  } = useFieldArray({
    control: form.control,
    name: "states",
    keyName: "trackingId", // Use `trackingId` as the unique key
  });

  const {
    fields: transitionFields,
    append: appendTransition,
    remove: removeTransition,
  } = useFieldArray({
    control: form.control,
    name: "transitions",
    keyName: "id", // Use the original `id` from the array
  });

  const [workflowStates, setWorkflowStates] = useState<
    { label: string; value: number | string }[]
  >([]);

  // Synchronize `workflowStates` with `stateFields`
  useEffect(() => {
    setWorkflowStates(
      stateFields.map((state, index) => ({
        label: state.stateName || `State ${index + 1}`, // Reflect user input or default placeholder
        value: state.id ?? index,
      })),
    );
  }, [stateFields]);

  const handleSubmit = (values: WorkflowDetailDTO) => {
    console.log(`Save workflow detail ${JSON.stringify(values)}`);
    onSave(values);
  };

  return (
    <div className="p-4 border rounded mb-4">
      <h2 className="text-lg font-bold mb-4">Edit Workflow</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Workflow Details */}
          <ExtInputField
            form={form}
            fieldName="name"
            label="Name"
            placeholder="Workflow Name"
            required={true}
          />
          <ExtInputField
            form={form}
            fieldName="requestName"
            label="Request Name"
            placeholder="Request Name"
            required={true}
          />
          <ExtTextAreaField
            form={form}
            fieldName="description"
            label="Description"
            placeholder="Description"
          />

          {/* States Section */}
          <div>
            <h3 className="text-md font-semibold mb-4">States</h3>
            {stateFields.map((state, index) => (
              <div
                key={state.trackingId || index} // Use `trackingId` as a unique key
                className="flex items-center gap-4 mb-4"
              >
                <div className="flex-1">
                  <ExtInputField
                    form={form}
                    fieldName={`states.${index}.stateName`}
                    label="State Name"
                    placeholder="Enter state name"
                    required={true}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm">Initial</label>
                  <Checkbox
                    checked={form.watch(`states.${index}.isInitial`)} // Watch for default and updated values
                    onCheckedChange={(value) =>
                      form.setValue(`states.${index}.isInitial`, Boolean(value))
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm">Final</label>
                  <Checkbox
                    checked={form.watch(`states.${index}.isFinal`)} // Watch for default and updated values
                    onCheckedChange={(value) =>
                      form.setValue(`states.${index}.isFinal`, Boolean(value))
                    }
                  />
                </div>
                <Button
                  variant="destructive"
                  onClick={() => removeState(index)}
                  className="h-10"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              onClick={() => {
                const newState = {
                  stateName: "",
                  isInitial: false,
                  isFinal: false,
                  workflowId: workflowDetail.id!,
                };
                appendState(newState);
              }}
              variant="secondary"
            >
              Add State
            </Button>
          </div>

          {/* Transitions Section */}
          <div>
            <h3 className="text-md font-semibold mb-4">Transitions</h3>
            {transitionFields.map((transition, index) => (
              <div
                key={transition.id || index} // Use the transition `id` as a unique key
                className="flex items-center gap-4 mb-4"
              >
                <div className="flex-1">
                  <WorkflowStatesSelect
                    fieldName={`transitions.${index}.sourceStateId`}
                    form={form}
                    label="Source State"
                    placeholder="Select source state"
                    options={workflowStates}
                    required={true}
                  />
                </div>
                <div className="flex-1">
                  <WorkflowStatesSelect
                    fieldName={`transitions.${index}.targetStateId`}
                    form={form}
                    label="Target State"
                    placeholder="Select target state"
                    options={workflowStates}
                    required={true}
                  />
                </div>
                <div className="flex-1">
                  <ExtInputField
                    form={form}
                    fieldName={`transitions.${index}.eventName`}
                    label="Event Name"
                    placeholder="Enter event name"
                    required={true}
                  />
                </div>
                <div className="flex-1">
                  <ExtInputField
                    form={form}
                    fieldName={`transitions.${index}.slaDuration`}
                    label="SLA Duration (hrs)"
                    placeholder="Enter SLA duration"
                    type="number"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm">Escalate</label>
                  <Checkbox
                    checked={form.watch(
                      `transitions.${index}.escalateOnViolation`,
                    )} // Watch for default and updated values
                    onCheckedChange={(value) =>
                      form.setValue(
                        `transitions.${index}.escalateOnViolation`,
                        Boolean(value),
                      )
                    }
                  />
                </div>
                <Button
                  variant="destructive"
                  onClick={() => removeTransition(index)}
                  className="h-10"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              onClick={() =>
                appendTransition({
                  sourceStateId: null,
                  targetStateId: null,
                  eventName: "",
                  slaDuration: null,
                  escalateOnViolation: false,
                  workflowId: workflowDetail.id!,
                })
              }
              variant="secondary"
            >
              Add Transition
            </Button>
          </div>

          {/* Save and Cancel Buttons */}
          <div className="flex justify-end space-x-4">
            <Button type="submit">Save</Button>
            <Button type="button" variant="secondary" onClick={onCancel}>
              Discard
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default WorkflowEditForm;
