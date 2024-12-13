import React from "react";

import { findTeamById } from "@/lib/actions/teams.action";
import { deobfuscateToNumber } from "@/lib/endecode";
import { TeamProvider } from "@/providers/team-provider";
import { UserTeamRoleProvider } from "@/providers/user-team-role-provider";

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ teamId: string }>;
}) => {
  const resolvedParams = await params;

  const teamIdNum =
    resolvedParams.teamId === "new"
      ? null
      : deobfuscateToNumber(resolvedParams.teamId);

  if (teamIdNum == null) {
    return children;
  }

  const team = await findTeamById(teamIdNum, false);

  return (
    <TeamProvider team={team}>
      <UserTeamRoleProvider teamId={teamIdNum}>{children}</UserTeamRoleProvider>
    </TeamProvider>
  );
};

export default Layout;
