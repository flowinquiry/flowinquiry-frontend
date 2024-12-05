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
  const teamIdNum =
    params.teamId === "new" ? null : deobfuscateToNumber(params.teamId);

  return (
    <>
      {teamIdNum === null ? (
        children
      ) : (
        <UserTeamRoleProvider teamId={teamIdNum}>
          {children}
        </UserTeamRoleProvider>
      )}
    </>
  );
}
