import React from "react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import TeamNavLayout from "@/components/teams/team-nav";
import { TeamRequestForm } from "@/components/teams/team-requests-form";
import { deobfuscateToNumber } from "@/lib/endecode";

export default async function Page({
  params,
}: {
  params: { teamId: string; requestId: string };
}) {
  const teamRequestId = deobfuscateToNumber(params.requestId);

  return (
    <ContentLayout title="Teams">
      <TeamNavLayout teamId={teamRequestId}>
        <TeamRequestForm teamRequestId={teamRequestId} />
      </TeamNavLayout>
    </ContentLayout>
  );
}
