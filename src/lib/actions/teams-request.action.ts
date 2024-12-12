import { unstable_noStore as noStore } from "next/dist/server/web/spec-extension/unstable-no-store";

import { doAdvanceSearch, get, post, put } from "@/lib/actions/commons.action";
import { BACKEND_API } from "@/lib/constants";
import { PageableResult } from "@/types/commons";
import { Pagination, QueryDTO } from "@/types/query";
import {
  PriorityDistributionDTO,
  TeamRequestDTO,
  TicketDistributionDTO,
  TicketStatisticsDTO,
} from "@/types/team-requests";
import {
  TeamTicketPriorityDistributionDTO,
  TicketActionCountByDateDTO,
} from "@/types/teams";

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

export const getTicketsAssignmentDistributionByTeam = async (
  teamId: number,
) => {
  return get<TicketDistributionDTO[]>(
    `${BACKEND_API}/api/team-requests/teams/${teamId}/ticket-distribution`,
  );
};

export const getTicketsPriorityDistributionByTeam = async (teamId: number) => {
  return get<PriorityDistributionDTO[]>(
    `${BACKEND_API}/api/team-requests/teams/${teamId}/priority-distribution`,
  );
};

export const getUnassignedTickets = async (
  teamId: number,
  page: number,
  sortBy: string,
  sortDirection: string,
) => {
  return get<PageableResult<TeamRequestDTO>>(
    `${BACKEND_API}/api/team-requests/teams/${teamId}/unassigned-tickets?page=${page}&size=5&sort=${sortBy},${sortDirection}`,
  );
};

export const getOverdueTicketsByTeam = async (
  teamId: number,
  page: number,
  sortBy: string,
  sortDirection: string,
) => {
  return get<PageableResult<TeamRequestDTO>>(
    `${BACKEND_API}/api/team-requests/teams/${teamId}/overdue-tickets?page=${page}&size=5&sort=${sortBy},${sortDirection}`,
  );
};

export const getTicketStatisticsByTeamId = async (teamId: number) => {
  return get<TicketStatisticsDTO>(
    `${BACKEND_API}/api/team-requests/teams/${teamId}/statistics`,
  );
};

export const getCountOverdueTicketsByTeamId = async (teamId: number) => {
  return get<number>(
    `${BACKEND_API}/api/team-requests/teams/${teamId}/overdue-tickets/count`,
  );
};

export const getTicketCreationDaySeries = async (
  teamId: number,
  days: number,
) => {
  return get<TicketActionCountByDateDTO[]>(
    `${BACKEND_API}/api/team-requests/teams/${teamId}/ticket-creations-day-series?days=${days}`,
  );
};

export const getOverdueTicketsByUser = async (
  userId: number,
  page: number,
  sortBy: string,
  sortDirection: string,
) => {
  return get<PageableResult<TeamRequestDTO>>(
    `${BACKEND_API}/api/team-requests/users/${userId}/overdue-tickets?page=${page}&size=5&sort=${sortBy},${sortDirection}`,
  );
};

export const getTeamTicketPriorityDistributionForUser = async (
  userId: number,
) => {
  return get<Array<TeamTicketPriorityDistributionDTO>>(
    `${BACKEND_API}/api/team-requests/users/${userId}/team-tickets-priority-distribution`,
  );
};
