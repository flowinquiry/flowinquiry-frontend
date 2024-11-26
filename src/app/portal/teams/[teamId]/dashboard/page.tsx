import { notFound } from "next/navigation";
import React from "react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import TeamDashboard from "@/components/teams/team-dashboard";
import TeamNavLayout from "@/components/teams/team-nav";
import { findTeamById } from "@/lib/actions/teams.action";
import { deobfuscateToNumber } from "@/lib/endecode";

const Page = async ({ params }: { params: { teamId: string } }) => {
  const team = await findTeamById(deobfuscateToNumber(params.teamId));
  if (!team) {
    notFound();
  }

  const breadcrumbItems = [
    { title: "Dashboard", link: "/portal" },
    { title: "Teams", link: "/portal/teams" },
    { title: team.name, link: "#" },
  ];

  return (
    <ContentLayout title="Teams">
      <Breadcrumbs items={breadcrumbItems} />
      <TeamNavLayout teamId={team.id!}>
        <TeamDashboard entity={team} />
      </TeamNavLayout>
    </ContentLayout>
  );
};

export default Page;
