"use server";

import { unstable_noStore as noStore } from "next/dist/server/web/spec-extension/unstable-no-store";

import {
  deleteExec,
  doAdvanceSearch,
  get,
  post,
} from "@/lib/actions/commons.action";
import { BACKEND_API } from "@/lib/constants";
import { PageableResult } from "@/types/commons";
import { Filter, Pagination } from "@/types/query";
import { TeamType } from "@/types/teams";
import { UserType, UserWithTeamRoleDTO } from "@/types/users";

export const findTeamById = async (teamId: number) => {
  return get<TeamType>(`${BACKEND_API}/api/teams/${teamId}`);
};

export async function searchTeams(
  filters: Filter[] = [],
  pagination: Pagination,
) {
  noStore();
  return doAdvanceSearch<TeamType>(
    `${BACKEND_API}/api/teams/search`,
    filters,
    pagination,
  );
}

export async function deleteTeams(ids: number[]) {
  return deleteExec(`${BACKEND_API}/api/teams`, ids);
}

export async function findMembersByTeamId(teamId: number) {
  return get<PageableResult<UserWithTeamRoleDTO>>(
    `${BACKEND_API}/api/teams/${teamId}/members`,
  );
}

export async function findTeamsByMemberId(userId: number) {
  return get<Array<TeamType>>(`${BACKEND_API}/api/teams/users/${userId}`);
}

export async function findUsersNotInTeam(userTerm: string, teamId: number) {
  return get<Array<UserType>>(
    `${BACKEND_API}/api/teams/searchUsersNotInTeam?userTerm=${userTerm}&&teamId=${teamId}`,
  );
}

export const addUsersToTeam = (teamId: number, userIds: number[]) => {
  return post(`${BACKEND_API}/api/teams/${teamId}/add-users`, userIds);
};

export const deleteUserFromTeam = async (teamId: number, userId: number) => {
  return deleteExec(`${BACKEND_API}/api/teams/${teamId}/users/${userId}`);
};
