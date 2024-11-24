import { notFound } from "next/navigation";
import React from "react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import TeamNavLayout from "@/components/teams/team-nav";
import TeamRequestDetailView from "@/components/teams/team-requests-detail";
import { findRequestById } from "@/lib/actions/teams-request.action";
import { deobfuscateToNumber, obfuscate } from "@/lib/endecode";

interface RequestDetailsProps {
  params: { teamId: string; requestId: string };
}

const RequestDetailsPage: React.FC<RequestDetailsProps> = async ({
  params,
}) => {
  const teamRequest = await findRequestById(
    deobfuscateToNumber(params.requestId),
  );
  if (
    !teamRequest ||
    teamRequest.teamId !== deobfuscateToNumber(params.teamId)
  ) {
    notFound();
  }

  const breadcrumbItems = [
    { title: "Dashboard", link: "/portal" },
    { title: "Teams", link: "/portal/teams" },
    {
      title: teamRequest.teamName!,
      link: `/portal/teams/${obfuscate(teamRequest.teamId)}`,
    },
    {
      title: "Requests",
      link: `/portal/teams/${obfuscate(teamRequest.teamId)}/requests`,
    },
    { title: teamRequest.requestTitle!, link: "#" },
  ];

  return (
    <ContentLayout title="Teams">
      <Breadcrumbs items={breadcrumbItems} />
      <TeamNavLayout teamId={teamRequest.teamId!}>
        <TeamRequestDetailView entity={teamRequest} />
      </TeamNavLayout>
    </ContentLayout>
  );
};

export default RequestDetailsPage;
