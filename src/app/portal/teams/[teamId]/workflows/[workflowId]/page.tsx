import React from "react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import WorkflowDetailView from "@/components/teams/team-workflow-detail-view";
import { deobfuscateToNumber } from "@/lib/endecode";

const Page = async ({
  params,
}: {
  params: { teamId: string; workflowId: string };
}) => {
  return (
    <ContentLayout title="Teams">
      <WorkflowDetailView workflowId={deobfuscateToNumber(params.workflowId)} />
    </ContentLayout>
  );
};

export default Page;
