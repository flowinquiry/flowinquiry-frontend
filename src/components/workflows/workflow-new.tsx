"use client";

import React from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Heading } from "@/components/heading";
import NewWorkflowFromScratch from "@/components/workflows/workflow-create-from-scratch";

const WorkflowNew = () => {
  const breadcrumbItems = [
    { title: "Dashboard", link: "/portal" },
    {
      title: "Workflows",
      link: `/portal/settings/workflows`,
    },
    { title: "New", link: "#" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Heading
            title="Create New Workflow"
            description="Select how you want to create the workflow"
          />
        </div>
      </div>
      <NewWorkflowFromScratch />
    </div>
  );
};

export default WorkflowNew;
