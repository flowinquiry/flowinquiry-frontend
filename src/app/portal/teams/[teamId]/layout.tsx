import React from "react";

import { findTeamById } from "@/lib/actions/teams.action";
import { deobfuscateToNumber } from "@/lib/endecode";
import { TeamProvider } from "@/providers/team-provider";
import { UserTeamRoleProvider } from "@/providers/user-team-role-provider";

export default async function TeamsLayout(props: {
  children: React.ReactNode;
  params: Promise<{ teamId: string }>;
}) {
  const params = await props.params;

  const { children } = props;

  const teamIdNum =
    params.teamId === "new" ? null : deobfuscateToNumber(params.teamId);

  if (teamIdNum == null) {
    return children;
  }

  const team = await findTeamById(teamIdNum, false);

  return (
    <TeamProvider team={team}>
      <UserTeamRoleProvider teamId={teamIdNum}>{children}</UserTeamRoleProvider>
    </TeamProvider>
  );
}
