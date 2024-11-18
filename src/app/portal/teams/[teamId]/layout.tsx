import React from "react";

import { deobfuscateToNumber } from "@/lib/endecode";
import { UserTeamRoleProvider } from "@/providers/user-team-role-provider";

export default function TeamsLayout({
  params,
  children,
}: {
  children: React.ReactNode;
  params: { teamId: string };
}) {
  const teamIdNum = deobfuscateToNumber(params.teamId);

  return (
    <UserTeamRoleProvider teamId={teamIdNum}>{children}</UserTeamRoleProvider>
  );
}
