import React from "react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import TeamDashboard from "@/components/teams/team-dashboard";

const Page = () => {
  return (
    <ContentLayout title="Teams">
      <TeamDashboard />
    </ContentLayout>
  );
};

export default Page;
