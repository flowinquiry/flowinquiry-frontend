import React from "react";

import { SimpleContentView } from "@/components/admin-panel/simple-content-view";
import WorkflowsView from "@/components/workflows/workflow-list";

const breadcrumbItems = [
  { title: "Dashboard", link: "/portal" },
  { title: "Settings", link: "/portal/settings" },
  { title: "Workflows", link: "/portal/settings/workflows" },
];

const Page = () => {
  return (
    <SimpleContentView title="Workflows" breadcrumbItems={breadcrumbItems}>
      <WorkflowsView />
    </SimpleContentView>
  );
};

export default Page;
