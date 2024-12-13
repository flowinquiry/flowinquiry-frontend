import React from "react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import TeamWorkflowDetailView from "@/components/teams/team-workflow-detail-view";
import { deobfuscateToNumber } from "@/lib/endecode";

const Page = async (props: {
  params: Promise<{ teamId: string; workflowId: string }>;
}) => {
  const params = await props.params;
  return (
    <ContentLayout title="Teams">
      <TeamWorkflowDetailView
        workflowId={deobfuscateToNumber(params.workflowId)}
      />
    </ContentLayout>
  );
};

export default Page;
