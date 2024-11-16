import { notFound } from "next/navigation";
import React from "react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import TeamNavLayout from "@/components/teams/team-nav";
import TeamRequestsView from "@/components/teams/team-requests";
import { findTeamById } from "@/lib/actions/teams.action";
import { deobfuscateToNumber, obfuscate } from "@/lib/endecode";

const Page = async ({ params }: { params: { teamId: string } }) => {
  const team = await findTeamById(deobfuscateToNumber(params.teamId));
  if (!team) {
    notFound();
  }

  const breadcrumbItems = [
    { title: "Dashboard", link: "/portal" },
    { title: "Teams", link: "/portal/teams" },
    { title: team.name, link: `/portal/teams/${obfuscate(team.id)}` },
    { title: "Requests", link: "#" },
  ];

  return (
    <ContentLayout title="Teams">
      <Breadcrumbs items={breadcrumbItems} />
      <TeamNavLayout team={team}>
        <TeamRequestsView entity={team} />
      </TeamNavLayout>
    </ContentLayout>
  );
};

export default Page;
