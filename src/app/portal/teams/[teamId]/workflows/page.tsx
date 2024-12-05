import React from "react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import TeamWorkflowsView from "@/components/teams/team-workflows";

const Page = () => {
  return (
    <ContentLayout title="Teams">
      <TeamWorkflowsView />
    </ContentLayout>
  );
};

export default Page;
