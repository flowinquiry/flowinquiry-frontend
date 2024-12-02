"use server";

import { deleteExec, get, post } from "@/lib/actions/commons.action";
import { BACKEND_API } from "@/lib/constants";
import {
  AuthorityDTO,
  AuthorityResourcePermissionDTO,
} from "@/types/authorities";
import { PageableResult } from "@/types/commons";
import { createQueryParams, Pagination } from "@/types/query";
import { UserType } from "@/types/users";

export const getAuthorities = async () => {
  return get<PageableResult<AuthorityDTO>>(`${BACKEND_API}/api/authorities`);
};

export const findAuthorityByName = async (name: string) => {
  return get<AuthorityDTO>(`${BACKEND_API}/api/authorities/${name}`);
};

export const createAuthority = async (authority: AuthorityDTO) => {
  return post<AuthorityDTO, AuthorityDTO>(
    `${BACKEND_API}/api/authorities`,
    authority,
  );
};

export const findPermissionsByAuthorityName = async (authorityName: string) => {
  return get<Array<AuthorityResourcePermissionDTO>>(
    `${BACKEND_API}/api/authority-permissions/${authorityName}`,
  );
};

export const batchSavePermissions = async (
  permissions: Array<AuthorityResourcePermissionDTO>,
) => {
  return post<
    Array<AuthorityResourcePermissionDTO>,
    Array<AuthorityResourcePermissionDTO>
  >(`${BACKEND_API}/api/authority-permissions/batchSave`, permissions);
};

export async function getUsersByAuthority(
  authority: string,
  pagination: Pagination,
) {
  const queryParams = createQueryParams(pagination);
  return get<PageableResult<UserType>>(
    `${BACKEND_API}/api/authorities/${authority}/users?${queryParams.toString()}`,
  );
}

export async function findUsersNotInAuthority(
  userTerm: string,
  authorityName: string,
) {
  return get<Array<UserType>>(
    `${BACKEND_API}/api/authorities/searchUsersNotInAuthority?userTerm=${userTerm}&&authorityName=${authorityName}`,
  );
}

export const addUsersToAuthority = (
  authorityName: string,
  userIds: number[],
) => {
  return post(
    `${BACKEND_API}/api/authorities/${authorityName}/add-users`,
    userIds,
  );
};

export const deleteUserFromAuthority = async (
  authorityName: string,
  userId: number,
) => {
  return deleteExec(
    `${BACKEND_API}/api/authorities/${authorityName}/users/${userId}`,
  );
};
