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
import { WorkflowDetailDTO } from "@/types/workflows";

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[80vw] h-full max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Review Workflow {workflowDetail?.name}</DialogTitle>
        </DialogHeader>

        <div className="flex-grow flex flex-col p-4">
          {loading ? (
            <div className="flex items-center justify-center flex-grow">
              Loading...
            </div>
          ) : (
            workflowDetail && (
              <ScrollArea className="relative flex-grow border border-gray-200 rounded-lg">
                <div className="w-full h-full overflow-auto relative flex justify-center items-center">
                  <div className="max-w-[1000px] max-h-[600px] w-full h-full">
                    <WorkflowDiagram workflowDetails={workflowDetail} />
                  </div>
                </div>
              </ScrollArea>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
