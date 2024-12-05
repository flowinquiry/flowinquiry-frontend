import { notFound } from "next/navigation";
import React from "react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import TeamUsersView from "@/components/teams/team-users";
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
    { title: "Members", link: "#" },
  ];

  return (
    <ContentLayout title="Teams">
      <TeamUsersView entity={team} />
    </ContentLayout>
  );
};

export default Page;
