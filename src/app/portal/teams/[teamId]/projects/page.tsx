import React from "react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import ProjectListView from "@/components/projects/project-list-view";

const Page = () => {
  return (
    <ContentLayout title="Teams">
      <ProjectListView />
    </ContentLayout>
  );
};

export default Page;
