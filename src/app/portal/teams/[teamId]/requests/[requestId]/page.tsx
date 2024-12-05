import { notFound } from "next/navigation";
import React from "react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import TeamRequestDetailView from "@/components/teams/team-requests-detail";
import { findRequestById } from "@/lib/actions/teams-request.action";
import { deobfuscateToNumber } from "@/lib/endecode";

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

  return (
    <ContentLayout title="Teams">
      <TeamRequestDetailView entity={teamRequest} />
    </ContentLayout>
  );
};

export default RequestDetailsPage;
