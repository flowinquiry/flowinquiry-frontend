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
import { getWorkflowDetail } from "@/lib/actions/workflows.action";
import { PermissionUtils } from "@/types/resources";
import { WorkflowDetailDTO } from "@/types/workflows";

const WorkflowDetailView = ({ workflowId }: { workflowId: number }) => {
  const [workflowDetail, setWorkflowDetail] =
    useState<WorkflowDetailDTO | null>(null);
  const permissionLevel = usePagePermission();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchWorkflowDetail() {
      getWorkflowDetail(workflowId)
        .then((data) => setWorkflowDetail(data))
        .finally(() => setLoading(false));
    }

    fetchWorkflowDetail();
  }, [workflowId]);

  const handleSave = async (updatedWorkflow: WorkflowDetailDTO) => {
    setLoading(true);
    try {
      // await updateWorkflowDetail(workflowId, updatedWorkflow);
      setWorkflowDetail(updatedWorkflow);
    } finally {
      setLoading(false);
      setIsEditing(false); // Ensure form stays open until save completes
    }
  };

  const breadcrumbItems = [
    { title: "Dashboard", link: "/portal" },
    { title: "Settings", link: "/portal/settings" },
    { title: "Workflows", link: `/portal/settings/workflows` },
    { title: workflowDetail?.name ?? "", link: "#" },
  ];

  if (!workflowDetail) {
    return <div>Loading the workflow detail ...</div>;
  }

  return (
    <div className="flex flex-col">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="flex flex-row justify-between mt-4 mb-4">
        <Heading
          title={workflowDetail.name}
          description={workflowDetail.description ?? ""}
        />
        {PermissionUtils.canWrite(permissionLevel) && (
          <div className="flex space-x-4">
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                <Edit /> Customize Workflow
              </Button>
            )}
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-4">
          <Spinner>
            <span>Loading workflow detail...</span>
          </Spinner>
        </div>
      )}

      {isEditing ? (
        <WorkflowEditForm
          workflowDetail={workflowDetail}
          onCancel={() => setIsEditing(false)}
          onSave={handleSave}
        />
      ) : (
        <WorkflowDiagram workflowDetails={workflowDetail} />
      )}
    </div>
  );
};

export default WorkflowDetailView;
