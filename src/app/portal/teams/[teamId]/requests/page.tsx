import React from "react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import TeamRequestsView from "@/components/teams/team-requests";

const Page = () => {
  return (
    <ContentLayout title="Teams">
      <TeamRequestsView />
    </ContentLayout>
  );
};

export default Page;
