"use server";

import { unstable_noStore as noStore } from "next/dist/server/web/spec-extension/unstable-no-store";

import { doAdvanceSearch, get, post, put } from "@/lib/actions/commons.action";
import { BACKEND_API } from "@/lib/constants";
import { Filter, Pagination } from "@/types/query";
import { TeamRequestDTO } from "@/types/teams";

export const createTeamRequest = async (teamRequest: TeamRequestDTO) => {
  return post<TeamRequestDTO, TeamRequestDTO>(
    `${BACKEND_API}/api/team-requests`,
    teamRequest,
  );
};

export const findRequestById = async (requestId: number) => {
  return get<TeamRequestDTO>(`${BACKEND_API}/api/team-requests/${requestId}`);
};

export const updateTeamRequest = async (
  teamRequestId: number,
  teamRequest: TeamRequestDTO,
) => {
  return put<TeamRequestDTO, TeamRequestDTO>(
    `${BACKEND_API}/api/team-requests/${teamRequestId}`,
    teamRequest,
  );
};

export async function searchTeamRequests(
  filters: Filter[] = [],
  pagination: Pagination,
) {
  noStore();
  return doAdvanceSearch<TeamRequestDTO>(
    `${BACKEND_API}/api/team-requests/search`,
    filters,
    pagination,
  );
}

export const findPreviousTeamRequest = async (requestId: number) => {
  return get<TeamRequestDTO>(
    `${BACKEND_API}/api/team-requests/${requestId}/previous`,
  );
};

export const findNextTeamRequest = async (requestId: number) => {
  return get<TeamRequestDTO>(
    `${BACKEND_API}/api/team-requests/${requestId}/next`,
  );
};
