"use server";

import { post } from "@/lib/actions/commons.action";
import { BACKEND_API } from "@/lib/constants";
import { TeamRequestType } from "@/types/teams";

export const createTeamRequest = async (teamRequest: TeamRequestType) => {
  return post<TeamRequestType, TeamRequestType>(
    `${BACKEND_API}/api/team-requests`,
    teamRequest,
  );
};
