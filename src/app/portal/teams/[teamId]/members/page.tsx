import React from "react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import TeamUsersView from "@/components/teams/team-users";

const Page = () => {
  return (
    <ContentLayout title="Teams">
      <TeamUsersView />
    </ContentLayout>
  );
};

export default Page;
