"use server";

import { unstable_noStore as noStore } from "next/dist/server/web/spec-extension/unstable-no-store";

import { doAdvanceSearch, get, post, put } from "@/lib/actions/commons.action";
import { BACKEND_API } from "@/lib/constants";
import { Filter, Pagination } from "@/types/query";
import { TeamRequestType } from "@/types/teams";

export const createTeamRequest = async (teamRequest: TeamRequestType) => {
  return post<TeamRequestType, TeamRequestType>(
    `${BACKEND_API}/api/team-requests`,
    teamRequest,
  );
};

export const findRequestById = async (requestId: number) => {
  return get<TeamRequestType>(`${BACKEND_API}/api/team-requests/${requestId}`);
};

export const updateTeamRequest = async (
  teamRequestId: number,
  teamRequest: TeamRequestType,
) => {
  return put<TeamRequestType, TeamRequestType>(
    `${BACKEND_API}/api/team-requests/${teamRequestId}`,
    teamRequest,
  );
};

export async function searchTeamRequests(
  filters: Filter[] = [],
  pagination: Pagination,
) {
  noStore();
  return doAdvanceSearch<TeamRequestType>(
    `${BACKEND_API}/api/team-requests/search`,
    filters,
    pagination,
  );
}
