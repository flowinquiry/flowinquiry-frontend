"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ExtInputField, ExtTextAreaField } from "@/components/ui/ext-form";
import { Form } from "@/components/ui/form";
import WorkflowStatesSelect from "@/components/workflows/workflow-states-select";
import { WorkflowDetailDTO, WorkflowDetailSchema } from "@/types/workflows";

let temporaryIdCounter = -1;

const WorkflowEditForm = ({
  workflowDetail,
  onCancel,
  onSave,
  onPreviewChange,
}: {
  workflowDetail: WorkflowDetailDTO;
  onCancel: () => void;
  onSave: (values: WorkflowDetailDTO) => void;
  onPreviewChange: (values: WorkflowDetailDTO) => void; // New prop for live preview
}) => {
  const form = useForm<WorkflowDetailDTO>({
    resolver: zodResolver(WorkflowDetailSchema),
    defaultValues: workflowDetail,
    mode: "onChange",
  });

  const {
    fields: stateFields,
    append: appendState,
    remove: removeState,
  } = useFieldArray({ control: form.control, name: "states" });

  const {
    fields: transitionFields,
    append: appendTransition,
    remove: removeTransition,
  } = useFieldArray({ control: form.control, name: "transitions" });

  const watchedValues = form.watch();

  // Debounce preview updates
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      onPreviewChange(watchedValues); // Update the preview with debounced values
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [watchedValues, onPreviewChange]);

  const handleSubmit = (values: WorkflowDetailDTO) => {
    onSave(values);
  };

  return (
    <div className="p-4 border rounded mb-4">
      <h2 className="text-lg font-bold mb-4">Edit Workflow</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div>
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
          </div>
          {/* States Section */}
          <div>
            <h3 className="text-md font-semibold mb-4">States</h3>
            {stateFields.map((state, index) => (
              <div
                key={state.id || index}
                className="flex items-center gap-4 mb-4"
              >
                <div className="flex-1">
                  <ExtInputField
                    form={form}
                    fieldName={`states.${index}.stateName`}
                    label="State Name"
                    placeholder="Enter state name"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm">Initial</label>
                  <Checkbox
                    checked={form.watch(`states.${index}.isInitial`)}
                    onCheckedChange={(value) =>
                      form.setValue(`states.${index}.isInitial`, Boolean(value))
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm">Final</label>
                  <Checkbox
                    checked={form.watch(`states.${index}.isFinal`)}
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
              type="button"
              onClick={() =>
                appendState({
                  stateName: "",
                  isInitial: false,
                  isFinal: false,
                  id: temporaryIdCounter--,
                  workflowId: workflowDetail.id!,
                })
              }
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
                key={transition.id || index}
                className="flex items-center gap-4 mb-4"
              >
                <div className="flex-1">
                  <WorkflowStatesSelect
                    fieldName={`transitions.${index}.sourceStateId`}
                    form={form}
                    label="Source State"
                    placeholder="Select source state"
                    options={watchedValues.states.map((state) => ({
                      label: state.stateName,
                      value: state.id!,
                    }))}
                    required
                  />
                </div>
                <div className="flex-1">
                  <WorkflowStatesSelect
                    fieldName={`transitions.${index}.targetStateId`}
                    form={form}
                    label="Target State"
                    placeholder="Select target state"
                    options={watchedValues.states.map((state) => ({
                      label: state.stateName,
                      value: state.id!,
                    }))}
                    required
                  />
                </div>
                <div className="flex-1">
                  <ExtInputField
                    form={form}
                    fieldName={`transitions.${index}.eventName`}
                    label="Event Name"
                    placeholder="Enter event name"
                    required
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
                    )}
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
              type="button"
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

          <div className="flex justify-start space-x-4">
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
