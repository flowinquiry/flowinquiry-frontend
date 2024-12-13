import React from "react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import TeamRequestDetailView from "@/components/teams/team-requests-detail";
import { deobfuscateToNumber } from "@/lib/endecode";

interface RequestDetailsProps {
  params: Promise<{ teamId: string; requestId: string }>;
}

const RequestDetailsPage = async (props: RequestDetailsProps) => {
  const params = await props.params;
  const teamRequestId = deobfuscateToNumber(params.requestId);

  return (
    <ContentLayout title="Teams">
      <TeamRequestDetailView teamRequestId={teamRequestId} />
    </ContentLayout>
  );
};

export default RequestDetailsPage;
