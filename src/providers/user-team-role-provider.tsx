"use client";

import { useSession } from "next-auth/react";
import React, { createContext, useContext, useEffect, useState } from "react";

import { getUserRoleInTeam } from "@/lib/actions/teams.action";
import { TeamRole } from "@/types/teams";

type UserTeamRoleContextType = {
  role: TeamRole;
  setRole: (role: TeamRole) => void;
};

const UserTeamRoleContext = createContext<UserTeamRoleContextType | undefined>(
  undefined,
);

export const UserTeamRoleProvider: React.FC<{
  teamId: number;
  children: React.ReactNode;
}> = ({ teamId, children }) => {
  const [role, setRole] = useState<TeamRole>("Guest");

  const { data: session, status } = useSession();
  useEffect(() => {
    async function fetchTeamRole() {
      if (status === "authenticated" && session) {
        const roleName = await getUserRoleInTeam(
          Number(session?.user?.id!),
          teamId,
        );
        setRole(roleName.role as TeamRole);
      }
    }
    fetchTeamRole();
  }, [teamId, session, status]);
  return (
    <UserTeamRoleContext.Provider value={{ role, setRole }}>
      {children}
    </UserTeamRoleContext.Provider>
  );
};

export const useUserTeamRole = (): UserTeamRoleContextType => {
  const context = useContext(UserTeamRoleContext);
  if (!context) {
    throw new Error(
      "useUserTeamRole must be used within a UserTeamRoleProvider",
    );
  }
  return context;
};
