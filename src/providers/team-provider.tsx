"use client";

import React, { createContext, ReactNode, useContext } from "react";

import { TeamDTO } from "@/types/teams";

interface TeamProviderProps {
  team: TeamDTO;
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
  team,
  children,
}) => {
  return <TeamContext.Provider value={team}>{children}</TeamContext.Provider>;
};
