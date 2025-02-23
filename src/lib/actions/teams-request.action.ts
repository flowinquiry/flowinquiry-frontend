import { doAdvanceSearch, get, post, put } from "@/lib/actions/commons.action";
import { formatDateParams } from "@/lib/datetime";
import { HttpError } from "@/lib/errors";
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

export const createTeamRequest = async (
  teamRequest: TeamRequestDTO,
  setError?: (error: HttpError | string | null) => void,
) => {
  return post<TeamRequestDTO, TeamRequestDTO>(
    `/api/team-requests`,
    teamRequest,
    setError,
  );
};

export const findRequestById = async (
  requestId: number,
  setError?: (error: HttpError | string | null) => void,
) => {
  return get<TeamRequestDTO>(`/api/team-requests/${requestId}`, setError);
};

export const updateTeamRequest = async (
  teamRequestId: number,
  teamRequest: TeamRequestDTO,
  setError?: (error: HttpError | string | null) => void,
) => {
  return put<TeamRequestDTO, TeamRequestDTO>(
    `/api/team-requests/${teamRequestId}`,
    teamRequest,
    setError,
  );
};

export async function searchTeamRequests(
  query: QueryDTO,
  pagination: Pagination,
  setError?: (error: HttpError | string | null) => void,
) {
  return doAdvanceSearch<TeamRequestDTO>(
    `/api/team-requests/search`,
    query,
    pagination,
    setError,
  );
}

export const findPreviousTeamRequest = async (
  requestId: number,
  setError?: (error: HttpError | string | null) => void,
) => {
  return get<TeamRequestDTO>(
    `/api/team-requests/${requestId}/previous`,
    setError,
  );
};

export const findNextTeamRequest = async (
  requestId: number,
  setError?: (error: HttpError | string | null) => void,
) => {
  return get<TeamRequestDTO>(`/api/team-requests/${requestId}/next`, setError);
};

export const getTicketsAssignmentDistributionByTeam = async (
  teamId: number,
  dateParams: { range?: string; from?: Date; to?: Date },
  setError?: (error: HttpError | string | null) => void,
) => {
  return get<TicketDistributionDTO[]>(
    `/api/team-requests/teams/${teamId}/ticket-distribution?${formatDateParams(dateParams)}`,
    setError,
  );
};

export const getTicketsPriorityDistributionByTeam = async (
  teamId: number,
  dateParams: { range?: string; from?: Date; to?: Date },
  setError?: (error: HttpError | string | null) => void,
) => {
  console.log("Date", formatDateParams(dateParams));
  return get<PriorityDistributionDTO[]>(
    `/api/team-requests/teams/${teamId}/priority-distribution?${formatDateParams(dateParams)}`,
    setError,
  );
};

export const getUnassignedTickets = async (
  teamId: number,
  page: number,
  sortBy: string,
  sortDirection: string,
  setError?: (error: HttpError | string | null) => void,
) => {
  return get<PageableResult<TeamRequestDTO>>(
    `/api/team-requests/teams/${teamId}/unassigned-tickets?page=${page}&size=5&sort=${sortBy},${sortDirection}`,
    setError,
  );
};

export const getOverdueTicketsByTeam = async (
  teamId: number,
  page: number,
  sortBy: string,
  sortDirection: string,
  setError?: (error: HttpError | string | null) => void,
) => {
  return get<PageableResult<TeamRequestDTO>>(
    `/api/team-requests/teams/${teamId}/overdue-tickets?page=${page}&size=5&sort=${sortBy},${sortDirection}`,
    setError,
  );
};

export const getTicketStatisticsByTeamId = async (
  teamId: number,
  dateParams: { range?: string; from?: Date; to?: Date },
  setError?: (error: HttpError | string | null) => void,
) => {
  return get<TicketStatisticsDTO>(
    `/api/team-requests/teams/${teamId}/statistics?${formatDateParams(dateParams)}`,
    setError,
  );
};

export const getCountOverdueTicketsByTeamId = async (
  teamId: number,
  dateParams: { range?: string; from?: Date; to?: Date },
  setError?: (error: HttpError | string | null) => void,
) => {
  return get<number>(
    `/api/team-requests/teams/${teamId}/overdue-tickets/count?${formatDateParams(dateParams)}`,
    setError,
  );
};

export const getTicketCreationDaySeries = async (
  teamId: number,
  days: number,
  setError?: (error: HttpError | string | null) => void,
) => {
  return get<TicketActionCountByDateDTO[]>(
    `/api/team-requests/teams/${teamId}/ticket-creations-day-series?days=${days}`,
    setError,
  );
};

export const getOverdueTicketsByUser = async (
  userId: number,
  page: number,
  sortBy: string,
  sortDirection: string,
  setError?: (error: HttpError | string | null) => void,
) => {
  return get<PageableResult<TeamRequestDTO>>(
    `/api/team-requests/users/${userId}/overdue-tickets?page=${page}&size=5&sort=${sortBy},${sortDirection}`,
    setError,
  );
};

export const getTeamTicketPriorityDistributionForUser = async (
  userId: number,
  setError?: (error: HttpError | string | null) => void,
) => {
  return get<Array<TeamTicketPriorityDistributionDTO>>(
    `/api/team-requests/users/${userId}/team-tickets-priority-distribution`,
    setError,
  );
};
