import { notFound } from "next/navigation";
import React from "react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import TeamNavLayout from "@/components/teams/team-nav";
import WorkflowDetailView from "@/components/teams/team-workflow-detail-view";
import { getWorkflowDetail } from "@/lib/actions/workflows.action";
import { deobfuscateToNumber, obfuscate } from "@/lib/endecode";

const Page = async ({
  params,
}: {
  params: { teamId: string; workflowId: string };
}) => {
  const workflowDetail = await getWorkflowDetail(
    deobfuscateToNumber(params.workflowId),
  );
  if (
    !workflowDetail ||
    workflowDetail.ownerId !== deobfuscateToNumber(params.teamId)
  ) {
    console.log(
      `Workflow Details ${workflowDetail.ownerId} ${deobfuscateToNumber(params.teamId)}`,
    );
    notFound();
  }

  const breadcrumbItems = [
    { title: "Dashboard", link: "/portal" },
    { title: "Teams", link: "/portal/teams" },
    {
      title: workflowDetail.ownerName,
      link: `/portal/teams/${obfuscate(workflowDetail.ownerId)}`,
    },
    {
      title: "Workflows",
      link: `/portal/teams/${obfuscate(workflowDetail.ownerId)}/workflows`,
    },
    { title: workflowDetail.name, link: "#" },
  ];

  return (
    <ContentLayout title="Teams">
      <Breadcrumbs items={breadcrumbItems} />
      <TeamNavLayout teamId={workflowDetail.ownerId!}>
        <WorkflowDetailView entity={workflowDetail} />
      </TeamNavLayout>
    </ContentLayout>
  );
};

export default Page;
