"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { findTeamById } from "@/lib/actions/teams.action";
import { TeamDTO } from "@/types/teams";

interface TeamProviderProps {
  teamId: number;
  children: ReactNode;
}

const TeamContext = createContext<TeamDTO | null>(null);

// Hook to access the team context
export const useTeam = (): TeamDTO => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
};

export const TeamProvider: React.FC<TeamProviderProps> = ({
  teamId,
  children,
}) => {
  const [team, setTeam] = useState<TeamDTO | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      findTeamById(teamId).then((data) => setTeam(data));
    };

    fetchTeam();
  }, [teamId]);

  if (!team) {
    return <div>Loading...</div>;
  }

  return <TeamContext.Provider value={team}>{children}</TeamContext.Provider>;
};
