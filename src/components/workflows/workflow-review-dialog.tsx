"use client";

import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WorkflowDiagram } from "@/components/workflows/workflow-diagram-view";
import { getWorkflowDetail } from "@/lib/actions/workflows.action";
import { useError } from "@/providers/error-provider";
import { WorkflowDetailDTO, WorkflowTransitionDTO } from "@/types/workflows";

interface WorkflowReviewDialogProps {
  workflowId: number;
  open: boolean;
  onClose: () => void;
}

export default function WorkflowReviewDialog({
  workflowId,
  open,
  onClose,
}: WorkflowReviewDialogProps) {
  const { setError } = useError();
  const [loading, setLoading] = useState(false);
  const [workflowDetail, setWorkflowDetail] =
    useState<WorkflowDetailDTO | null>(null);

  useEffect(() => {
    if (open) {
      async function fetchWorkflowDetail() {
        setLoading(true);
        try {
          const data = await getWorkflowDetail(workflowId, setError);
          setWorkflowDetail(data);
        } finally {
          setLoading(false);
        }
      }

      fetchWorkflowDetail();
    }
  }, [open, workflowId]);

  /**
   * Finds state name by state ID
   */
  const getStateName = (stateId: number | null) => {
    return (
      workflowDetail?.states.find((state) => state.id === stateId)?.stateName ||
      "Unknown"
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[80vw] h-full max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Review Workflow: {workflowDetail?.name}</DialogTitle>
        </DialogHeader>

        {/* Layout: Left -> Diagram | Right -> Transitions List */}
        <div className="flex flex-grow gap-4 p-4">
          {/* Left: Workflow Diagram (Scrollable) */}
          <div className="flex-grow border border-gray-200 rounded-lg overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                Loading...
              </div>
            ) : (
              workflowDetail && (
                <ScrollArea className="w-full h-full">
                  <div className="w-full h-full overflow-auto flex justify-center items-center">
                    <div className="max-w-[1000px] max-h-[600px] w-full h-full">
                      <WorkflowDiagram workflowDetails={workflowDetail} />
                    </div>
                  </div>
                </ScrollArea>
              )
            )}
          </div>

          {/* Right: Transitions & SLA Info (Scrollable) */}
          <div className="w-[350px] border border-gray-200 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
            <h3 className="text-lg font-semibold mb-2">State Transitions</h3>
            <ScrollArea className="h-[calc(80vh-150px)]">
              {workflowDetail?.transitions.length ? (
                workflowDetail.transitions.map(
                  (transition: WorkflowTransitionDTO) => (
                    <div
                      key={transition.id}
                      className="p-2 border-b border-gray-300 last:border-b-0"
                    >
                      <p className="text-sm">
                        <strong>[{transition.eventName}]</strong>{" "}
                        {getStateName(transition.sourceStateId!)} →{" "}
                        {getStateName(transition.targetStateId!)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        SLA:{" "}
                        {transition.slaDuration
                          ? `${transition.slaDuration} hours`
                          : "No SLA"}{" "}
                        | Escalated:{" "}
                        {transition.escalateOnViolation ? "Yes" : "No"}
                      </p>
                    </div>
                  ),
                )
              ) : (
                <p className="text-sm text-gray-500">
                  No transitions available.
                </p>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
