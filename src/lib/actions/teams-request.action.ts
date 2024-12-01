"use server";

import { unstable_noStore as noStore } from "next/dist/server/web/spec-extension/unstable-no-store";

import { doAdvanceSearch, get, post, put } from "@/lib/actions/commons.action";
import { BACKEND_API } from "@/lib/constants";
import { PageableResult } from "@/types/commons";
import { Pagination, QueryDTO } from "@/types/query";
import {
  PriorityDistributionDTO,
  TeamRequestDTO,
  TicketDistributionDTO,
} from "@/types/team-requests";

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
  query: QueryDTO,
  pagination: Pagination,
) {
  noStore();
  console.log(`Filters ${JSON.stringify(query)}`);
  return doAdvanceSearch<TeamRequestDTO>(
    `${BACKEND_API}/api/team-requests/search`,
    query,
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

export const getTicketsAssignmentDistribution = async (teamId: number) => {
  return get<TicketDistributionDTO[]>(
    `${BACKEND_API}/api/team-requests/${teamId}/ticket-distribution`,
  );
};

export const getTicketsPriorityDistribution = async (teamId: number) => {
  return get<PriorityDistributionDTO[]>(
    `${BACKEND_API}/api/team-requests/${teamId}/priority-distribution`,
  );
};

export const getUnassignedTickets = async (
  teamId: number,
  page: number,
  sortBy: string,
  sortDirection: string,
) => {
  return get<PageableResult<TeamRequestDTO>>(
    `${BACKEND_API}/api/team-requests/${teamId}/unassigned-tickets?page=${page - 1}&&size=5&&sortBy=${sortBy}&&sortDirection=${sortDirection}`,
  );
};
