import React from "react";

import ProjectView from "@/components/projects/project-view";
import { deobfuscateToNumber } from "@/lib/endecode";

interface ProjectDetailPageProps {
  params: Promise<{ teamId: string; projectId: string }>;
}

const ProjectDetailPage = async (props: ProjectDetailPageProps) => {
  const params = await props.params;
  const projectId = deobfuscateToNumber(params.projectId);

  return <ProjectView projectId={projectId} />;
};

export default ProjectDetailPage;
