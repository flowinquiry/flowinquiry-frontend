"use client";

import { Edit } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { WorkflowDiagram } from "@/components/workflows/workflow-diagram-view";
import WorkflowEditForm from "@/components/workflows/workflow-editor-form";
import { usePagePermission } from "@/hooks/use-page-permission";
import {
  getWorkflowDetail,
  updateWorkflowDetail,
} from "@/lib/actions/workflows.action";
import { PermissionUtils } from "@/types/resources";
import { WorkflowDetailDTO } from "@/types/workflows";

const GlobalWorkflowDetailView = ({ workflowId }: { workflowId: number }) => {
  const permissionLevel = usePagePermission();
  const [workflowDetail, setWorkflowDetail] =
    useState<WorkflowDetailDTO | null>(null);
  const [previewWorkflowDetail, setPreviewWorkflowDetail] =
    useState<WorkflowDetailDTO | null>(null); // Separate state for preview
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchWorkflowDetail() {
      setLoading(true);
      getWorkflowDetail(workflowId)
        .then((data) => {
          setWorkflowDetail(data);
          setPreviewWorkflowDetail(data); // Initialize preview with the original workflow
        })
        .finally(() => setLoading(false));
    }

    fetchWorkflowDetail();
  }, [workflowId]);

  const handleSave = (updatedWorkflow: WorkflowDetailDTO) => {
    updateWorkflowDetail(updatedWorkflow.id!, updatedWorkflow).then((data) => {
      setWorkflowDetail(data); // Update the main workflow detail
      setPreviewWorkflowDetail(data); // Sync preview with saved workflow
      setIsEditing(false);
    });
  };

  if (!workflowDetail) {
    return <div>Error loading workflow detail.</div>;
  }

  const breadcrumbItems = [
    { title: "Dashboard", link: "/portal" },
    {
      title: "Workflows",
      link: `/portal/settings/workflows`,
    },
    { title: workflowDetail.name, link: "#" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4">
      <Breadcrumbs items={breadcrumbItems} />
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Heading
            title={workflowDetail.name}
            description={workflowDetail.description ?? ""}
          />
        </div>
        {PermissionUtils.canWrite(permissionLevel) && (
          <div className="flex space-x-4">
            <Button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel Edit" : <Edit />} Customize Workflow
            </Button>
          </div>
        )}
      </div>

      {/* Spinner When Loading */}
      {loading && (
        <div className="flex items-center justify-center py-4">
          <Spinner>
            <span>Loading workflow detail...</span>
          </Spinner>
        </div>
      )}

      {/* Workflow Editor Form */}
      {isEditing && workflowDetail && !loading && (
        <WorkflowEditForm
          workflowDetail={workflowDetail}
          onCancel={() => setIsEditing(false)}
          onSave={handleSave}
          onPreviewChange={setPreviewWorkflowDetail} // Update preview in real-time
        />
      )}

      {/* Workflow Diagram */}
      {previewWorkflowDetail && !loading && (
        <WorkflowDiagram workflowDetails={previewWorkflowDetail} />
      )}
    </div>
  );
};

export default GlobalWorkflowDetailView;
