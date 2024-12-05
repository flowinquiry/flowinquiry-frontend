import { notFound } from "next/navigation";
import React from "react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
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
    { title: "Tickets", link: "#" },
  ];

  return (
    <ContentLayout title="Teams">
      <TeamRequestsView entity={team} />
    </ContentLayout>
  );
};

export default Page;
