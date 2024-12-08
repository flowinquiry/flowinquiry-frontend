import React from "react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import TeamWorkflowDetailView from "@/components/teams/team-workflow-detail-view";
import { deobfuscateToNumber } from "@/lib/endecode";

const Page = async ({
  params,
}: {
  params: { teamId: string; workflowId: string };
}) => {
  return (
    <ContentLayout title="Teams">
      <TeamWorkflowDetailView
        workflowId={deobfuscateToNumber(params.workflowId)}
      />
    </ContentLayout>
  );
};

export default Page;
