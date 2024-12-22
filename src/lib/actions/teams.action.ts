import {
  deleteExec,
  doAdvanceSearch,
  get,
  post,
} from "@/lib/actions/commons.action";
import { BACKEND_API } from "@/lib/constants";
import { Pagination, QueryDTO } from "@/types/query";
import { TeamDTO, TransitionItemCollectionDTO } from "@/types/teams";
import { UserDTO, UserWithTeamRoleDTO } from "@/types/users";

export const findTeamById = async (
  teamId: number,
  setError?: (error: string | null) => void,
) => {
  return get<TeamDTO>(`${BACKEND_API}/api/teams/${teamId}`, setError);
};

export async function searchTeams(
  query: QueryDTO,
  pagination: Pagination,
  setError?: (error: string | null) => void,
) {
  return doAdvanceSearch<TeamDTO>(
    `${BACKEND_API}/api/teams/search`,
    query,
    pagination,
    setError,
  );
}

export async function deleteTeams(
  ids: number[],
  setError?: (error: string | null) => void,
) {
  return deleteExec(`${BACKEND_API}/api/teams`, ids, setError);
}

export async function findMembersByTeamId(
  teamId: number,
  setError?: (error: string | null) => void,
) {
  return get<Array<UserWithTeamRoleDTO>>(
    `${BACKEND_API}/api/teams/${teamId}/members`,
    setError,
  );
}

export async function findTeamsByMemberId(
  userId: number,
  setError?: (error: string | null) => void,
) {
  return get<Array<TeamDTO>>(
    `${BACKEND_API}/api/teams/users/${userId}`,
    setError,
  );
}

export async function findUsersNotInTeam(
  userTerm: string,
  teamId: number,
  setError?: (error: string | null) => void,
) {
  return get<Array<UserDTO>>(
    `${BACKEND_API}/api/teams/searchUsersNotInTeam?userTerm=${userTerm}&&teamId=${teamId}`,
    setError,
  );
}

export const addUsersToTeam = (
  teamId: number,
  userIds: number[],
  teamRole: string,
  setError?: (error: string | null) => void,
) => {
  return post(
    `${BACKEND_API}/api/teams/${teamId}/add-users`,
    {
      userIds: userIds,
      role: teamRole,
    },
    setError,
  );
};

export const deleteUserFromTeam = async (
  teamId: number,
  userId: number,
  setError?: (error: string | null) => void,
) => {
  return deleteExec(
    `${BACKEND_API}/api/teams/${teamId}/users/${userId}`,
    undefined,
    setError,
  );
};

export const getUserRoleInTeam = async (
  userId: number,
  teamId: number,
  setError?: (error: string | null) => void,
) => {
  return get<Record<string, string>>(
    `${BACKEND_API}/api/teams/${teamId}/users/${userId}/role`,
    setError,
  );
};

export const getTeamRequestStateChangesHistory = async (
  ticketId: number,
  setError?: (error: string | null) => void,
) => {
  return get<TransitionItemCollectionDTO>(
    `${BACKEND_API}/api/team-requests/${ticketId}/states-history`,
    setError,
  );
};
