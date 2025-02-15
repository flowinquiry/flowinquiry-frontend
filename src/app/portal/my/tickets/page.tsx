import React from "react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import MyTeamRequestsView from "@/components/my/my-team-requests";

const Page = () => {
  return (
    <ContentLayout title="My Tickets">
      <MyTeamRequestsView />
    </ContentLayout>
  );
};

export default Page;
