import React from "react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import ProjectView from "@/components/projects/project-view";
import { deobfuscateToNumber } from "@/lib/endecode";

interface ProjectDetailPageProps {
  params: Promise<{ teamId: string; projectId: string }>;
}

const ProjectDetailPage = async (props: ProjectDetailPageProps) => {
  const params = await props.params;
  const projectId = deobfuscateToNumber(params.projectId);

  return (
    <ContentLayout
      title="Teams"
      useDefaultStyles={false}
      className="h-full pt-8 pb-8 px-4 sm:px-8 bg-card"
    >
      <ProjectView projectId={projectId} />
    </ContentLayout>
  );
};

export default ProjectDetailPage;
